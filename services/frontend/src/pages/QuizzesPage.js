import React, { useState, useEffect } from 'react';
import { Box, CircularProgress, Typography, List, ListItem, ListItemText } from '@mui/material';
import { fetchQuizzesByModuleId } from '../services/fakeApi'; // Adjust the import path

const QuizzesPage = ({ courseId, moduleId }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const data = await fetchQuizzesByModuleId(courseId, moduleId);
        setQuizzes(data);
      } catch (error) {
        console.error('Failed to load quizzes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadQuizzes();
  }, [courseId, moduleId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={2}>Loading quizzes...</Typography>
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Quizzes for Course ID: {courseId}, Module ID: {moduleId}
      </Typography>
      {quizzes.length === 0 ? (
        <Typography>No quizzes available for this module.</Typography>
      ) : (
        <List>
          {quizzes.map((quiz) => (
            <ListItem key={quiz.quiz_id}>
              <ListItemText
                primary={quiz.title}
                secondary={`Date: ${new Date(quiz.date).toLocaleDateString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default QuizzesPage;
