import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
  Paper,
  useTheme,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DoneIcon from '@mui/icons-material/Done';
import { fetchQuizById, submitQuiz, fetchStudentQuizResults } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState(
    JSON.parse(localStorage.getItem(`quiz-${quizId}-answers`)) || {}
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(
    JSON.parse(localStorage.getItem(`quiz-${quizId}-currentQuestionIndex`)) || 0
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCountdown, setInitialCountdown] = useState(
    JSON.parse(localStorage.getItem(`quiz-${quizId}-initialCountdown`)) || 5
  );
  const [quizCountdown, setQuizCountdown] = useState(
    JSON.parse(localStorage.getItem(`quiz-${quizId}-quizCountdown`)) || null
  );
  const [submissionResult, setSubmissionResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});

  const theme = useTheme();

  useEffect(() => {
    if (!student) {
      navigate('/');
    }
  }, [student, navigate]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fetchedQuiz = await fetchQuizById(quizId);
        setQuiz(fetchedQuiz);

        const result = await fetchStudentQuizResults(quizId, student.id);
        if (result) {
          setCorrectAnswers(result.correctAnswers || {});
          const initialAnswers = result.answers.reduce((acc, answer) => {
            acc[answer.questionId] = answer.answerText;
            return acc;
          }, {});
          setAnswers(initialAnswers);
          localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(initialAnswers));
          const percentage = (result.score / fetchedQuiz.questions.length) * 100;
          setSubmissionResult(percentage);
          setQuizCompleted(true);
        } else {
          const initialTime = fetchedQuiz.quiz_length ? fetchedQuiz.quiz_length * 60 : 300;
          if (!quizCountdown) {
            setQuizCountdown(initialTime);
          }
        }

        setLoading(false);
      } catch (err) {
        setError('Failed to load the quiz');
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, student.id]);

  useEffect(() => {
    const storedCountdownComplete = JSON.parse(localStorage.getItem(`quiz-${quizId}-countdownComplete`));
    if (!quizCompleted && initialCountdown > 0 && !storedCountdownComplete) {
      const countdownTimer = setInterval(() => {
        setInitialCountdown((prev) => {
          const newCountdown = prev - 1;
          localStorage.setItem(`quiz-${quizId}-initialCountdown`, JSON.stringify(newCountdown));
          if (newCountdown === 0) {
            localStorage.setItem(`quiz-${quizId}-countdownComplete`, true);
          }
          return newCountdown;
        });
      }, 1000);
      return () => clearInterval(countdownTimer);
    } else if (storedCountdownComplete) {
      setInitialCountdown(0); // Skip countdown if it's already completed
    }
  }, [initialCountdown, quizCompleted, quizId]);

  useEffect(() => {
    if (initialCountdown === 0 && !quizCompleted && quizCountdown > 0) {
      const quizTimer = setInterval(() => {
        setQuizCountdown((prev) => {
          if (prev === 1) {
            clearInterval(quizTimer);
            handleSubmit();
            return 0;
          }
          const newQuizCountdown = prev - 1;
          localStorage.setItem(`quiz-${quizId}-quizCountdown`, JSON.stringify(newQuizCountdown));
          return newQuizCountdown;
        });
      }, 1000);
      return () => clearInterval(quizTimer);
    } else if (quizCountdown === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [quizCountdown, initialCountdown, quizCompleted, quizId]);

  // Save the quiz state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`quiz-${quizId}-currentQuestionIndex`, currentQuestionIndex);
    localStorage.setItem(`quiz-${quizId}-quizCountdown`, JSON.stringify(quizCountdown));
  }, [currentQuestionIndex, quizCountdown, quizId]);

  const handleOptionChange = (questionId, optionText) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: optionText,
    };
    setAnswers(updatedAnswers);
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(updatedAnswers));
  };

  const handleTextAnswerChange = (questionId, value) => {
    const updatedAnswers = {
      ...answers,
      [questionId]: value,
    };
    setAnswers(updatedAnswers);
    localStorage.setItem(`quiz-${quizId}-answers`, JSON.stringify(updatedAnswers));
  };

  const handleSubmit = async () => {
    if (!student) {
      setError('Student information is missing.');
      return;
    }

    try {
      await submitQuiz(quizId, student.id, answers);
      const result = await fetchStudentQuizResults(quizId, student.id);
      setCorrectAnswers(result.correctAnswers || {});

      const percentage = (result.score / quiz.questions.length) * 100;

      setSubmissionResult(percentage);
      setQuizCompleted(true);
      localStorage.removeItem(`quiz-${quizId}-answers`);
      localStorage.removeItem(`quiz-${quizId}-currentQuestionIndex`);
      localStorage.removeItem(`quiz-${quizId}-quizCountdown`);
      localStorage.removeItem(`quiz-${quizId}-initialCountdown`);
      localStorage.removeItem(`quiz-${quizId}-countdownComplete`);
    } catch (err) {
      setError('Failed to submit the quiz. Your answers are saved locally.');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem' }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem' }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  const totalQuestions = quiz.questions.length;

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem' }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ padding: '2rem' }}>
            <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
              {quiz?.quizName || quiz?.quiz_name}
            </Typography>
            <Divider sx={{ mb: 3 }} />
            {quizCompleted ? (
              <>
                {submissionResult !== null && (
                    <Box textAlign="center" my={4}>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                      {submissionResult.toFixed(2)}%
                    </Typography>
                  </Box>
                  
                )}
                {quiz.questions.map((question, index) => (
                  <Box key={question.id} mb={4}>
                    <Typography variant="h6" color="textSecondary" gutterBottom>
                      {`Question ${index + 1}: ${question.text}`}
                    </Typography>
                    {correctAnswers[question.id]?.[0]?.answerText && (
                      <Typography variant="subtitle2" color="success.main">
                        Correct Answer: {correctAnswers[question.id][0].answerText}
                      </Typography>
                    )}
                    {question.type === 'text' ? (
                      <TextField
                        fullWidth
                        multiline
                        rows={3}
                        value={answers[question.id] || ''}
                        disabled
                        sx={{ mb: 2 }}
                      />
                    ) : (
                      <RadioGroup value={answers[question.id] || ''}>
                        {question.options.map((option) => {
                          const correctAnswerArray = correctAnswers[question.id] || [];
                          const correctAnswer =
                            correctAnswerArray.length > 0 ? correctAnswerArray[0].answerText : '';
                          const isCorrect = option.text === correctAnswer;
                          const isSelected = option.text === answers[question.id];
                          const bgColor = isSelected
                            ? isCorrect
                              ? theme.palette.success.light
                              : theme.palette.error.light
                            : isCorrect
                            ? theme.palette.success.light
                            : 'inherit';
                          return (
                            <FormControlLabel
                              key={option.id}
                              value={option.text}
                              control={<Radio />}
                              label={option.text}
                              sx={{
                                backgroundColor: bgColor,
                                borderRadius: '4px',
                                mb: 1,
                                '& .MuiSvgIcon-root': { color: isCorrect ? 'green' : 'red' },
                              }}
                              disabled
                            />
                          );
                        })}
                      </RadioGroup>
                    )}
                  </Box>
                ))}
                <Box display="flex" justifyContent="center" mt={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/')}
                    endIcon={<DoneIcon />}
                  >
                    Back to Courses
                  </Button>
                </Box>
              </>
            ) : (
              <>
                {initialCountdown > 0 ? (
                  <Box textAlign="center" my={4}>
                    <Typography variant="h5">
                      Quiz starting in {initialCountdown} seconds...
                    </Typography>
                  </Box>
                ) : (
                  <>
                    {quiz.questions.map((question, index) => (
                      <Box key={question.id} mb={4} id={`question-${index + 1}`}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          {`Question ${index + 1}: ${question.text}`}
                        </Typography>
                        {question.type === 'text' ? (
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            value={answers[question.id] || ''}
                            onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                            sx={{ mb: 2 }}
                          />
                        ) : (
                          <RadioGroup
                            value={answers[question.id] || ''}
                            onChange={(e) => handleOptionChange(question.id, e.target.value)}
                          >
                            {question.options.map((option) => (
                              <FormControlLabel
                                key={option.id}
                                value={option.text}
                                control={<Radio />}
                                label={option.text}
                                sx={{
                                  borderRadius: '8px',
                                  mb: 1,
                                  backgroundColor:
                                    answers[question.id] === option.text
                                      ? theme.palette.action.hover
                                      : 'inherit',
                                  transition: 'background-color 0.3s',
                                }}
                              />
                            ))}
                          </RadioGroup>
                        )}
                      </Box>
                    ))}
                    <Box display="flex" justifyContent="flex-end" mt={3}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={Object.keys(answers).length !== quiz.questions.length}
                        endIcon={<DoneIcon />}
                      >
                        Submit Quiz
                      </Button>
                    </Box>
                  </>
                )}
              </>
            )}
          </Paper>
        </Grid>
        {/* Side Panel */}
        <Grid item xs={12} md={3}>
          <Paper
            elevation={3}
            sx={{
              p: 1,
              position: { md: 'sticky' },
              top: { md: 80 },
              maxHeight: '80vh',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '0.4em',
              },
              '&::-webkit-scrollbar-track': {
                boxShadow: 'inset 0 0 6px rgba(0,0,0,0.1)',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme.palette.grey[400],
                outline: '1px solid slategrey',
              },
            }}
          >
            <Typography variant="subtitle1" gutterBottom>
              Quiz Details
            </Typography>
            {!quizCompleted && (
              <>
                <Typography variant="body2" color="error" sx={{ mb: 1 }}>
                  Time Remaining: {formatTime(quizCountdown || 0)}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Answered: {Object.keys(answers).length} / {quiz.questions.length}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Questions
                </Typography>
                <List dense>
                  {quiz.questions.map((question, index) => (
                    <ListItem
                      button
                      key={question.id}
                      onClick={() => {
                        document.getElementById(`question-${index + 1}`).scrollIntoView({
                          behavior: 'smooth',
                        });
                      }}
                    >
                      <ListItemIcon>
                        {answers[question.id] ? (
                          <CheckCircleIcon color="primary" fontSize="small" />
                        ) : (
                          <RadioButtonUncheckedIcon color="action" fontSize="small" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={`Question ${index + 1}`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  sx={{ mt: 1 }}
                >
                  Scroll to Top
                </Button>
              </>
            )}
            {quizCompleted && (
              <>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Total Questions: {quiz.questions.length}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Correct Answers:{' '}
                  {Math.round((submissionResult / 100) * quiz.questions.length)}
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle1" gutterBottom>
                  Questions Review
                </Typography>
                <List dense>
                  {quiz.questions.map((question, index) => {
                    const isCorrect = answers[question.id] === correctAnswers[question.id]?.[0]?.answerText;
                    return (
                      <ListItem key={question.id} sx={{ alignItems: 'flex-start' }}>
                        <ListItemIcon>
                          {isCorrect ? (
                            <CheckCircleIcon color="primary" fontSize="small" />
                          ) : (
                            <CancelIcon color="error" fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={`Question ${index + 1}`}
                          primaryTypographyProps={{ variant: 'body2' }}
                        />
                      </ListItem>
                    );
                  })}
                </List>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/')}
                  sx={{ mt: 1 }}
                >
                  Back to Courses
                </Button>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TakeQuizPage;
