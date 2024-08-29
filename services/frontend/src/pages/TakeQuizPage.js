import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
} from '@mui/material';
import { fetchQuizById } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0); // Timer state

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
    const timer = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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

  const handleSubmit = () => {
    console.log('Submitted Answers:', answers);
    // Handle submission to backend
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
        borderRadius: '8px'
      }}
    >
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

      <TableContainer component={Paper}>
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
                      borderBottom: 'none',
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
                        value={answers[question.id] ?? ''}
                        onChange={(e) =>
                          handleOptionChange(question.id, Number(e.target.value))
                        }
                      >
                        {question.options.map((option, optIndex) => (
                          <FormControlLabel
                            key={optIndex}
                            value={optIndex}
                            control={<Radio />}
                            label={option.answer_text}
                            sx={{ display: 'block', marginY: '0.5rem' }}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Your answer"
                        value={answers[question.id] || ''}
                        onChange={(e) =>
                          handleTextAnswerChange(question.id, e.target.value)
                        }
                        sx={{ backgroundColor: '#fafafa', borderRadius: '4px' }}
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

      
    </Container>
  );
};

export default TakeQuizPage;
