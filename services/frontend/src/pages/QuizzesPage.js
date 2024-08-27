import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  TextField,
  Button,
  IconButton,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchModulesByCourseId, addQuizToModule } from '../services/fakeApi'; // Ensure this function is in your API
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const QuizzesPage = () => {
  const { courseId } = useParams(); // Get courseId from the route
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateQuiz, setShowCreateQuiz] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [newQuizDate, setNewQuizDate] = useState('');
  const [newQuestions, setNewQuestions] = useState([]);
  const [currentQuestionText, setCurrentQuestionText] = useState('');
  const [currentOptions, setCurrentOptions] = useState([{ text: '', correct: false }]);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const loadedModules = await fetchModulesByCourseId(courseId);
        setModules(loadedModules);
      } catch (err) {
        setError('Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [courseId]);

  const handleAddQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      { text: currentQuestionText, options: currentOptions },
    ]);
    setCurrentQuestionText('');
    setCurrentOptions([{ text: '', correct: false }]);
  };

  const handleOptionChange = (index, value) => {
    const options = [...currentOptions];
    options[index].text = value;
    setCurrentOptions(options);
  };

  const handleAddOption = () => {
    setCurrentOptions([...currentOptions, { text: '', correct: false }]);
  };

  const handleCreateQuiz = async () => {
    if (!newQuizTitle || !newQuizDate || newQuestions.length === 0) {
      alert('Please fill in all fields and add at least one question.');
      return;
    }

    try {
      await addQuizToModule(courseId, newQuizTitle, newQuizDate, newQuestions);
      // Reload the quizzes after adding a new one
      const loadedModules = await fetchModulesByCourseId(courseId);
      setModules(loadedModules);
      setShowCreateQuiz(false);
      setNewQuizTitle('');
      setNewQuizDate('');
      setNewQuestions([]);
    } catch (err) {
      setError('Failed to create the quiz.');
    }
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
    <Box padding={3}>
      <Typography variant="h4" gutterBottom>
        Quizzes
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => setShowCreateQuiz(!showCreateQuiz)}
        startIcon={<AddCircleOutlineIcon />}
      >
        {showCreateQuiz ? 'Cancel' : 'Create New Quiz'}
      </Button>

      {showCreateQuiz && (
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
          <Typography variant="h5" gutterBottom>
            Create a New Quiz
          </Typography>
          <TextField
            label="Quiz Title"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newQuizTitle}
            onChange={(e) => setNewQuizTitle(e.target.value)}
          />
          <TextField
            label="Quiz Date"
            variant="outlined"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={newQuizDate}
            onChange={(e) => setNewQuizDate(e.target.value)}
          />
          <Typography variant="h6" gutterBottom>
            Questions
          </Typography>
          <TextField
            label="Question Text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={currentQuestionText}
            onChange={(e) => setCurrentQuestionText(e.target.value)}
          />
          <Typography variant="body1" gutterBottom>
            Options:
          </Typography>
          {currentOptions.map((option, index) => (
            <TextField
              key={index}
              label={`Option ${index + 1}`}
              variant="outlined"
              fullWidth
              margin="normal"
              value={option.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          ))}
          <Button variant="text" color="primary" onClick={handleAddOption}>
            Add Another Option
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleAddQuestion} style={{ marginTop: '20px' }}>
            Add Question
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateQuiz}
            style={{ marginTop: '20px' }}
          >
            Create Quiz
          </Button>
        </Paper>
      )}

      {modules.length === 0 ? (
        <Typography variant="h6" style={{ marginTop: '20px' }}>No quizzes available for this course.</Typography>
      ) : (
        modules.map((module) => (
          <Box key={module.module_id} mb={4}>
            <Typography variant="h5" gutterBottom>
              {module.module_name}
            </Typography>

            {module.quizzes.length === 0 ? (
              <Typography variant="body1">No quizzes available for this module.</Typography>
            ) : (
              <Paper elevation={3} style={{ padding: '20px' }}>
                <List>
                  {module.quizzes.map((quiz) => (
                    <React.Fragment key={quiz.quiz_id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={quiz.title}
                          secondary={
                            <>
                              <Typography variant="body2" color="textSecondary">
                                Date: {new Date(quiz.date).toLocaleDateString()}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Total Questions: {quiz.questions.length}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Students Completed: {quiz.completed_by.length}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
                </List>
              </Paper>
            )}
          </Box>
        ))
      )}
    </Box>
  );
};

export default QuizzesPage;
