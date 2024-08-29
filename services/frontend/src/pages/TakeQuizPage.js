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
import { fetchQuizById, submitQuiz, fetchStudentQuizResults, fetchStudentByUniqueId } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [uniqueId, setUniqueId] = useState('');
  const [student, setStudent] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [previousResult, setPreviousResult] = useState(null);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fetchedQuiz = await fetchQuizById(quizId);
        setQuiz(fetchedQuiz);
        setLoading(false);
      } catch (err) {
        setError('Failed to load the quiz');
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quizStarted) {
      const timer = setInterval(() => {
        setTimeElapsed((prevTime) => prevTime + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizStarted]);

  const checkPreviousSubmission = async (id) => {
    try {
      const result = await fetchStudentQuizResults(quizId, id);
      if (result) {
        setPreviousResult(result);
        setSubmissionResult(result);
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

  const handleStartQuiz = async () => {
    if (!uniqueId) {
      setError('Please enter your unique student ID.');
      return;
    }

    try {
      const fetchedStudent = await fetchStudentByUniqueId(uniqueId);
      if (!fetchedStudent) {
        setError('Student not found.');
        return;
      }
      setStudent(fetchedStudent);
      await checkPreviousSubmission(fetchedStudent.id);

      if (!previousResult) {
        setQuizStarted(true);
      }
      setError(null);
    } catch (err) {
      setError('Error retrieving student information.');
    }
  };

  const handleSubmit = async () => {
    if (!student) {
      setError('Student information is missing.');
      return;
    }

    try {
      const result = await submitQuiz(parseInt(quizId), parseInt(student.id), answers);
      setSubmissionResult(result);
      setQuizStarted(false);
      console.log('Quiz submitted:', result);

      navigate(`/quiz-result/${quizId}`, { state: { result } });
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

  if (error && !quizStarted) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '8px',
      }}
    >
      {!quizStarted && !submissionResult ? (
        <>
          <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={2}>
            Enter Your Unique Student ID to Start the Quiz
          </Typography>
          <TextField
            label="Unique Student ID"
            variant="outlined"
            fullWidth
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            sx={{ marginBottom: 3 }}
          />
          {error && <Alert severity="error" sx={{ marginBottom: 3 }}>{error}</Alert>}
          <Button
            variant="contained"
            onClick={handleStartQuiz}
            sx={{
              backgroundColor: '#34495e',
              color: 'white',
              padding: '10px 20px',
              boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
            }}
          >
            Start Quiz
          </Button>
        </>
      ) : (
        <>
          {submissionResult && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {submissionResult.message}
            </Alert>
          )}
          {submissionResult && (
            <Typography variant="h5" color="#2a2a3b" fontWeight="bold" mt={3} mb={2}>
              Final Score: {submissionResult.score}%
            </Typography>
          )}
          <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={2}>
            {quiz?.quiz_name}
          </Typography>
          <Typography variant="body1" color="#2a2a3b" mb={3}>
            {quiz?.description}
          </Typography>
          {quizStarted && (
            <Box mt={2} display="flex" justifyContent="center">
              <Typography variant="body2" color="#2a2a3b">
                Time Elapsed: {formatTime(timeElapsed)}
              </Typography>
            </Box>
          )}

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question, index) => {
                  const studentAnswer = previousResult
                    ? previousResult.questionResults.find((res) => res.questionId === question.id)?.studentAnswer
                    : answers[question.id];
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
                          Question {index + 1}: {question.question_text} - {isCorrect ? 'Correct' : 'Incorrect'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} sx={{ padding: '16px' }}>
                          {question.question_type === 'multipleChoice' ? (
                            <RadioGroup
                              value={studentAnswer || ''}
                              onChange={(e) => handleOptionChange(question.id, Number(e.target.value))}
                              disabled={!!submissionResult}
                            >
                              {question.options.map((option) => (
                                <FormControlLabel
                                  key={option.id}
                                  value={option.id}
                                  control={<Radio />}
                                  label={`${option.answer_text} ${option.correct ? '(Correct)' : ''}`}
                                  sx={{
                                    color: option.correct ? '#4caf50' : studentAnswer === option.id ? '#f44336' : '#000',
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          ) : (
                            <TextField
                              fullWidth
                              variant="outlined"
                              value={studentAnswer || ''}
                              onChange={(e) => handleTextAnswerChange(question.id, e.target.value)}
                              disabled={!!submissionResult}
                              error={!isCorrect}
                              helperText={!isCorrect ? `Correct answer: ${correctAnswer}` : ''}
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!submissionResult && quizStarted && (
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
          )}
        </>
      )}
    </Container>
  );
};

export default TakeQuizPage;
