import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
import { fetchQuizById, submitQuiz } from '../services/fakeApi'; // Import submitQuiz

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [studentId, setStudentId] = useState('');
  const [quizStarted, setQuizStarted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

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

  const handleStartQuiz = () => {
    if (!studentId) {
      setError('Please enter your unique student ID.');
      return;
    }
    setQuizStarted(true);
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      const result = await submitQuiz(quizId, studentId, answers);
      setSubmissionResult(result);
      setQuizStarted(false);
      setError(null);

      // Redirect to a results page or prevent redoing the quiz
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
            Enter Your Student ID to Start the Quiz
          </Typography>
          <TextField
            label="Student ID"
            variant="outlined"
            fullWidth
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
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
          <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={2}>
            {quiz?.quiz_name}
          </Typography>
          <Typography variant="body1" color="#2a2a3b" mb={3}>
            {quiz?.description}
          </Typography>
          <Box mt={2} display="flex" justifyContent="center">
            <Typography variant="body2" color="#2a2a3b">
              Time Elapsed: {formatTime(timeElapsed)}
            </Typography>
          </Box>

          {submissionResult && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {submissionResult.message}
            </Alert>
          )}

          <TableContainer component={Paper} sx={{ mt: 3 }}>
            <Table>
              <TableBody>
                {quiz?.questions.map((question, index) => {
                  const studentAnswer = answers[question.id];
                  const correctAnswer = submissionResult?.questionResults.find(
                    (res) => res.questionId === question.id
                  )?.correctAnswer;
                  const isCorrect = submissionResult?.questionResults.find(
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
                            borderBottom: 'none',
                            padding: '16px',
                          }}
                        >
                          Question {index + 1}: {question.question_text} -{' '}
                          {isCorrect ? 'Correct' : 'Incorrect'}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell colSpan={2} sx={{ padding: '16px' }}>
                          {question.question_type === 'multipleChoice' ? (
                            <RadioGroup
                              value={studentAnswer}
                              onChange={(e) =>
                                handleOptionChange(question.id, Number(e.target.value))
                              }
                              disabled={submissionResult !== null} // Disable after submission
                            >
                              {question.options.map((option, optIndex) => (
                                <FormControlLabel
                                  key={optIndex}
                                  value={option.id}
                                  control={<Radio />}
                                  label={option.answer_text}
                                  sx={{
                                    display: 'block',
                                    marginY: '0.5rem',
                                    color:
                                      option.correct && submissionResult
                                        ? '#4caf50'
                                        : studentAnswer === option.id && !option.correct && submissionResult
                                        ? '#f44336'
                                        : '#000',
                                  }}
                                />
                              ))}
                            </RadioGroup>
                          ) : (
                            <TextField
                              fullWidth
                              variant="outlined"
                              placeholder="Your answer"
                              value={studentAnswer || ''}
                              onChange={(e) =>
                                handleTextAnswerChange(question.id, e.target.value)
                              }
                              sx={{ backgroundColor: '#fafafa', borderRadius: '4px' }}
                              disabled={submissionResult !== null}
                              error={submissionResult && !isCorrect}
                              helperText={
                                submissionResult && !isCorrect
                                  ? `Correct answer: ${correctAnswer}`
                                  : ''
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          {!submissionResult && (
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
