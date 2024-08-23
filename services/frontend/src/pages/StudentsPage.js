// src/components/StudentsPage.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { fetchStudentsByCourseId } from '../services/fakeApi';

const StudentsPage = ({ courseId }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await fetchStudentsByCourseId(courseId);
        setStudents(data);
      } catch (err) {
        setError('Failed to load students.');
      } finally {
        setLoading(false);
      }
    };
    loadStudents();
  }, [courseId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={2}>Loading students...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h6">Students</Typography>
      <List>
        {students.map((student) => (
          <ListItem key={student.student_id}>
            <ListItemText primary={student.name} secondary={`Email: ${student.email}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default StudentsPage;
