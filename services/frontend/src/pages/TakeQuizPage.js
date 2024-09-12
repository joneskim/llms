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

const StyledFormControlLabel = styled(FormControlLabel)(({ theme, isSelected, isCorrect }) => ({
  '.MuiRadio-root': {
    color: isSelected ? (isCorrect ? theme.palette.success.main : theme.palette.error.main) : 'inherit',
  },
  color: isSelected ? (isCorrect ? theme.palette.success.main : theme.palette.error.main) : 'inherit',
  border: isSelected ? `1px solid ${isCorrect ? theme.palette.success.main : theme.palette.error.main}` : 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  marginBottom: '8px',
  backgroundColor: isSelected ? (isCorrect ? theme.palette.success.light : theme.palette.error.light) : 'inherit',
}));

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {}; // Ensure this is passed from the previous page
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCountdown, setInitialCountdown] = useState(5); // Initial countdown in seconds
  const [quizCountdown, setQuizCountdown] = useState(null); // Quiz countdown in seconds
  const [submissionResult, setSubmissionResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState({}); // State to store correct answers

  useEffect(() => {
    if (!student) {
      navigate('/'); // Redirect to home or a relevant page if student info is missing
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
          setAnswers(result.answers || []); // Load the student's previous answers
          const percentage = (result.score / fetchedQuiz.questions.length) * 100;
          setSubmissionResult(percentage);
          setQuizCompleted(true);
        } else {
          const initialTime = fetchedQuiz.quiz_length ? fetchedQuiz.quiz_length * 60 : 300; // Default to 5 minutes if not set
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
    if (!quizCompleted && initialCountdown > 0) {
      const countdownTimer = setInterval(() => {
        setInitialCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [initialCountdown, quizCompleted]);

  useEffect(() => {
    if (initialCountdown === 0 && !quizCompleted && quizCountdown > 0) {
      const quizTimer = setInterval(() => {
        setQuizCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(quizTimer);
    } else if (quizCountdown === 0 && !quizCompleted) {
      handleSubmit(); // Automatically submit when quiz countdown reaches zero
    }
  }, [quizCountdown, initialCountdown, quizCompleted]);

  const handleOptionChange = (questionId, optionText) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  const handleTextAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
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
      const result = await submitQuiz(quiz.id, student.id, answers);
      setCorrectAnswers(result.correctAnswers || {}); // Safeguard against undefined correctAnswers

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
      <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem' }}>
        <CircularProgress />
        <Typography>Loading...</Typography>
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
        borderRadius: '8px',
        backgroundColor: '#f4f4f9',
      }}
    >
      {quizCompleted ? (
        <>
          {submissionResult && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {`Your score: ${submissionResult}%`}
            </Alert>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
            <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
              {quiz?.quiz_name}
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question) => {
                  const studentAnswer = answers.find(ans => ans.questionId === question.id)?.answerText;
                  const correctAnswer = correctAnswers[question.id];
                  return (
                    <TableRow key={question.id}>
                      <TableCell>
                        <Typography variant="h6" color="#2a2a3b">
                          {question.text}
                        </Typography>
                        <RadioGroup value={studentAnswer || ''}>
                          {question.options.map((option) => {
                            const isCorrect = option.text === correctAnswer;
                            const isSelected = option.text === studentAnswer;
                            return (
                              <StyledFormControlLabel
                                key={option.id}
                                value={option.text}
                                control={<Radio />}
                                label={option.text}
                                isSelected={isSelected}
                                isCorrect={isCorrect}
                                sx={{
                                  backgroundColor: isSelected
                                    ? isCorrect
                                      ? 'rgba(76, 175, 80, 0.1)' // Green background for correct answer
                                      : 'rgba(244, 67, 54, 0.1)' // Red background for incorrect answer
                                    : 'inherit',
                                }}
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
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell>
                      <Typography variant="h6" color="#2a2a3b">
                        {question.text}
                      </Typography>
                      {question.type === 'text' ? (
                        <TextField
                          fullWidth
                          multiline
                          rows={3}
                          value={answers.find(ans => ans.questionId === question.id)?.answerText || ''}
                          onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                          sx={{ mb: 2 }}
                        />
                      ) : (
                        <RadioGroup
                          value={answers.find(ans => ans.questionId === question.id)?.answerText || ''}
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
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TakeQuizPage;
