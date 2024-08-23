// src/components/AssignmentsPage.js
import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, Typography, CircularProgress, Box } from '@mui/material';
import { fetchAssignmentsByModuleId } from '../services/fakeApi';

const AssignmentsPage = ({ courseId, moduleId }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAssignments = async () => {
      try {
        const data = await fetchAssignmentsByModuleId(courseId, moduleId);
        setAssignments(data);
      } catch (err) {
        setError('Failed to load assignments.');
      } finally {
        setLoading(false);
      }
    };
    loadAssignments();
  }, [courseId, moduleId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={2}>Loading assignments...</Typography>
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
      <Typography variant="h6">Assignments</Typography>
      <List>
        {assignments.map((assignment) => (
          <ListItem key={assignment.assignment_id}>
            <ListItemText primary={assignment.title} secondary={`Due Date: ${assignment.due_date}`} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default AssignmentsPage;
