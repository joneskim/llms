import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchQuizById } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { quizId } = useParams(); // Fetch the quizId from the route parameters
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({}); // State to track user answers

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const fetchedQuiz = await fetchQuizById(quizId);
        setQuiz(fetchedQuiz);
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId]);

  // Handle answer change for multiple choice and text answer questions
  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  // Submit the quiz and handle logic (e.g., scoring, feedback)
  const handleSubmit = () => {
    // Logic for submitting answers goes here
    console.log('Submitted answers:', answers);
    alert('Quiz submitted successfully!');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Typography variant="h4" fontWeight="bold" color="#2a2a3b" gutterBottom>
        {quiz.quiz_name}
      </Typography>
      <Typography variant="body1" color="textSecondary" mb={3}>
        {quiz.description}
      </Typography>

      {quiz.questions.map((question, index) => (
        <Paper key={question.id} elevation={2} sx={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}: {question.question_text}
          </Typography>
          <Divider sx={{ marginBottom: '1rem' }} />

          {question.question_type === 'multipleChoice' && question.options ? (
            <RadioGroup
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option.id}
                  value={option.answer_text}
                  control={<Radio />}
                  label={option.answer_text}
                />
              ))}
            </RadioGroup>
          ) : (
            <TextField
              fullWidth
              multiline
              rows={3}
              variant="outlined"
              placeholder="Type your answer here..."
              value={answers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              sx={{ marginTop: '1rem', backgroundColor: '#f7f7f7' }}
            />
          )}
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        fullWidth
        sx={{ marginTop: '2rem', padding: '1rem' }}
      >
        Submit Quiz
      </Button>
    </Container>
  );
};

export default TakeQuizPage;
