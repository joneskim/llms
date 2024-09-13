import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  styled,
} from '@mui/material';
import { fetchQuizById, submitQuiz, fetchStudentQuizResults } from '../services/fakeApi';

// Custom styled components
const StyledFormControlLabel = styled(FormControlLabel)(({ theme }) => ({
  borderRadius: '8px',
  padding: '8px 16px',
  marginBottom: '8px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ScoreBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  color: theme.palette.common.white,
  padding: theme.spacing(4),
  borderRadius: '16px',
  textAlign: 'center',
  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.3)',
  position: 'relative',
  overflow: 'hidden',
  marginBottom: theme.spacing(4),
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-20px',
    left: '-20px',
    width: '100px',
    height: '100px',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '50%',
    opacity: 0.3,
    filter: 'blur(15px)',
    zIndex: 1,
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    bottom: '-20px',
    right: '-20px',
    width: '100px',
    height: '100px',
    backgroundColor: theme.palette.secondary.main,
    borderRadius: '50%',
    opacity: 0.3,
    filter: 'blur(15px)',
    zIndex: 1,
  },
}));

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {};
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizCountdown, setQuizCountdown] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({});

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
          const percentage = (result.score / fetchedQuiz.questions.length) * 100;
          setSubmissionResult(percentage);
          setQuizCompleted(true);
        } else {
          const initialTime = fetchedQuiz.quiz_length ? fetchedQuiz.quiz_length * 60 : 300;
          setQuizCountdown(initialTime);
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
    if (quizCountdown > 0 && !quizCompleted) {
      const quizTimer = setInterval(() => {
        setQuizCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(quizTimer);
    } else if (quizCountdown === 0 && !quizCompleted) {
      handleSubmit();
    }
  }, [quizCountdown, quizCompleted]);

  const handleOptionChange = (questionId, optionText) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleTextAnswerChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!student) {
      setError('Student information is missing.');
      return;
    }

    try {
      await submitQuiz(quiz.id, student.id, answers);
      const result = await fetchStudentQuizResults(quizId, student.id);
      setCorrectAnswers(result.correctAnswers || {});

      const percentage = (result.score / quiz.questions.length) * 100;
      setSubmissionResult(percentage);
      setQuizCompleted(true);
    } catch (err) {
      setError('Failed to submit the quiz.');
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ marginTop: 2 }}>
          Loading...
        </Typography>
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

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '12px',
        backgroundColor: '#f9f9fb',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
      }}
    >
      {quizCompleted ? (
        <>
          {submissionResult !== null && (
            <ScoreBox>
              <Typography variant="h3" fontWeight="bold" sx={{ zIndex: 2, position: 'relative' }}>
                {submissionResult}%
              </Typography>
              <Typography variant="h6" sx={{ zIndex: 2, position: 'relative', marginTop: 1 }}>
                Your Score
              </Typography>
            </ScoreBox>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
            <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
              {quiz?.quiz_name}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <TableContainer component={Paper} sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'none' }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question) => {
                  const studentAnswer = answers[question.id] || 'Option not found';
                  const correctAnswerArray = correctAnswers[question.id] || [];
                  const correctAnswer = correctAnswerArray.length > 0 ? correctAnswerArray[0].answerText : '';

                  return (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Typography variant="h6" color="#2a2a3b" fontWeight="bold" gutterBottom>
                          {question.text}
                        </Typography>
                        <RadioGroup value={studentAnswer || ''}>
                          {question.options.map((option) => {
                            const isCorrect = option.text === correctAnswer;
                            const isSelected = option.text === studentAnswer;
                            const bgColor = isSelected
                              ? isCorrect
                                ? 'rgba(76, 175, 80, 0.1)' // Green for correct answer
                                : 'rgba(244, 67, 54, 0.1)' // Red for incorrect answer
                              : isCorrect
                              ? 'rgba(76, 175, 80, 0.1)' // Green for correct answer
                              : 'inherit';
                            return (
                              <StyledFormControlLabel
                                key={option.id}
                                value={option.text}
                                control={<Radio />}
                                label={option.text}
                                sx={{ backgroundColor: bgColor }}
                              />
                            );
                          })}
                        </RadioGroup>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
              {quiz?.quiz_name}
            </Typography>
            <Typography variant="h6" color="#2a2a3b">
              Time Left: {formatTime(quizCountdown || 0)}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <TableContainer component={Paper} sx={{ backgroundColor: '#fff', borderRadius: '8px', boxShadow: 'none' }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Typography variant="h6" color="#2a2a3b" fontWeight="bold" gutterBottom>
                        {question.text}
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
                            <StyledFormControlLabel
                              key={option.id}
                              value={option.text}
                              control={<Radio />}
                              label={option.text}
                            />
                          ))}
                        </RadioGroup>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box display="flex" justifyContent="flex-end" mt={3}>
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TakeQuizPage;
