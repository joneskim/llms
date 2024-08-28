import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchQuizzesByModuleId } from '../services/fakeApi';

const TakeQuizPage = () => {
  const { moduleId, quizId } = useParams(); // Extract moduleId and quizId from the route
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        // Fetch quizzes for the module and find the specific quiz by quizId
        const quizzes = await fetchQuizzesByModuleId(moduleId);
        const selectedQuiz = quizzes.find((quiz) => quiz.id === Number(quizId));
        setQuiz(selectedQuiz);
      } catch (err) {
        setError('Failed to load quiz.');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [moduleId, quizId]);

  const handleAnswerChange = (questionId, selectedOption) => {
    setUserAnswers({ ...userAnswers, [questionId]: selectedOption });
  };

  const handleSubmitQuiz = () => {
    // Logic for submitting quiz answers; you can implement grading here
    console.log('User Answers:', userAnswers);
    alert('Quiz submitted!'); // Feedback to user
    navigate(-1); // Navigate back to the previous page
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

  if (!quiz) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography variant="h5">Quiz not found.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" gutterBottom>
        {quiz.quiz_name}
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {quiz.description || 'No description available for this quiz.'}
      </Typography>

      {quiz.questions.map((question, index) => (
        <Paper key={question.id} sx={{ padding: '1rem', marginBottom: '1.5rem', backgroundColor: '#fff' }}>
          <Typography variant="h6" gutterBottom>
            Question {index + 1}: {question.question_text}
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select your answer:</FormLabel>
            <RadioGroup
              aria-label={`question-${question.id}`}
              name={`question-${question.id}`}
              value={userAnswers[question.id] || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            >
              {question.options.map((option, optIndex) => (
                <FormControlLabel
                  key={optIndex}
                  value={option.text}
                  control={<Radio />}
                  label={option.text}
                />
              ))}
            </RadioGroup>
          </FormControl>
        </Paper>
      ))}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitQuiz}
        sx={{
          backgroundColor: '#2a2a3b',
          color: 'white',
          marginTop: '2rem',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
        }}
        fullWidth
      >
        Submit Quiz
      </Button>
    </Container>
  );
};

export default TakeQuizPage;
