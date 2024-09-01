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
} from '@mui/material';
import { fetchQuizById, submitQuiz, fetchStudentQuizResults } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = location.state || {}; // Ensure this is passed from the previous page
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initialCountdown, setInitialCountdown] = useState(5);
  const [quizCountdown, setQuizCountdown] = useState(300); // Example: 5 minutes timer
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

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
        await checkPreviousSubmission(student.id);
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
        setInitialCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdownTimer);
    }
  }, [initialCountdown, quizCompleted]);

  useEffect(() => {
    if (initialCountdown === 0 && !quizCompleted && quizCountdown > 0) {
      const quizTimer = setInterval(() => {
        setQuizCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(quizTimer);
    } else if (quizCountdown === 0 && !quizCompleted) {
      handleSubmit(); // Automatically submit when quiz countdown reaches zero
    }
  }, [quizCountdown, initialCountdown, quizCompleted]);

  const checkPreviousSubmission = async (id) => {
    try {
      const result = await fetchStudentQuizResults(quizId, id);
      if (result) {
        setPreviousResult(result);
        setSubmissionResult(result);
        setQuizCompleted(true); // Mark the quiz as completed
      }
    } catch (err) {
      console.error('Failed to fetch previous submission:', err);
    }
  };

  const handleOptionChange = (questionId, optionIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
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
      const result = await submitQuiz(parseInt(quizId), student.id, answers);
      setSubmissionResult(result);
      setQuizCompleted(true);
      window.location.reload(); 
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
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
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
              {submissionResult.message}
            </Alert>
          )}
          <Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
            <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
              {quiz?.quiz_name}
            </Typography>
            <Typography
              variant="h5"
              color="#2a2a3b"
              fontWeight="bold"
              sx={{
                padding: '10px 20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              Score: {submissionResult?.score}%
            </Typography>
          </Box>
          <Typography variant="body1" color="#2a2a3b" mb={3}>
            {quiz?.description}
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question, index) => {
                  const studentAnswer = previousResult?.questionResults.find(
                    (res) => res.questionId === question.id
                  )?.studentAnswer;
                  const correctAnswer = previousResult?.questionResults.find(
                    (res) => res.questionId === question.id
                  )?.correctAnswer;
                  const isCorrect = previousResult?.questionResults.find(
                    (res) => res.questionId === question.id
                  )?.isCorrect;

                  return (
                    <React.Fragment key={question.id}>
                      <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                        <TableCell
                          colSpan={2}
                          sx={{
                            color: '#ffffff',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            padding: '16px',
                          }}
                        >
                          Question {index + 1}: {question.question_text}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} sx={{ padding: '16px' }}>
                          {question.question_type === 'multipleChoice' ? (
                            <RadioGroup value={studentAnswer || ''} disabled>
                              {question.options.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  value={option.id}
                                  control={<Radio />}
                                  label={`${option.answer_text} ${
                                    option.id === correctAnswer ? '(Correct)' : ''
                                  }`}
                                  sx={{
                                    color:
                                      option.id === studentAnswer
                                        ? isCorrect
                                          ? '#4caf50'
                                          : '#f44336'
                                        : '#000',
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          ) : (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={studentAnswer || 'No Answer'}
                              disabled
                              error={!isCorrect}
                              helperText={!isCorrect ? `Correct answer: ${correctAnswer}` : ''}
                            />
                          )}
                          <Typography
                            color={isCorrect ? 'green' : 'red'}
                            fontWeight="bold"
                          >
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2}>
                          <Divider />
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : initialCountdown > 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" mt={10}>
          <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
            Quiz Starting In...
          </Typography>
          <Typography variant="h1" color="#d32f2f" fontWeight="bold" mt={3}>
            {initialCountdown}
          </Typography>
        </Box>
      ) : (
        <>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
              {quiz?.quiz_name}
            </Typography>
            <Typography
              variant="body2"
              color="#d32f2f"
              fontWeight="bold"
              sx={{
                padding: '10px 20px',
                backgroundColor: '#e0e0e0',
                borderRadius: '8px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              Time Remaining: {formatTime(quizCountdown)}
            </Typography>
          </Box>
          <Typography variant="body1" color="#2a2a3b" mb={3}>
            {quiz?.description}
          </Typography>
          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question, index) => (
                  <React.Fragment key={question.id}>
                    <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                      <TableCell
                        colSpan={2}
                        sx={{
                          color: '#ffffff',
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          padding: '16px',
                        }}
                      >
                        Question {index + 1}: {question.question_text}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} sx={{ padding: '16px' }}>
                        {question.question_type === 'multipleChoice' ? (
                          <RadioGroup
                            value={answers[question.id] || ''}
                            onChange={(e) =>
                              handleOptionChange(question.id, Number(e.target.value))
                            }
                          >
                            {question.options.map((option) => (
                              <FormControlLabel
                                key={option.id}
                                value={option.id}
                                control={<Radio />}
                                label={option.answer_text}
                              />
                            ))}
                          </RadioGroup>
                        ) : (
                          <TextField
                            fullWidth
                            variant="outlined"
                            value={answers[question.id] || ''}
                            onChange={(e) =>
                              handleTextAnswerChange(question.id, e.target.value)
                            }
                          />
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2}>
                        <Divider />
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box mt={4} display="flex" justifyContent="center">
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#34495e',
                color: 'white',
                padding: '10px 20px',
                boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
              }}
            >
              Submit Quiz
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default TakeQuizPage;
