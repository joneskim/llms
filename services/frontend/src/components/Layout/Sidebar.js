// src/components/Sidebar.js
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, Paper } from '@mui/material';

const Sidebar = () => {
  const { courseId } = useParams(); // Get courseId from URL parameters

  return (
    <Paper elevation={2} sx={{ width: '250px', height: '100vh', position: 'fixed' }}>
      <List component="nav">
        <ListItem button component={Link} to={`/course/${courseId}/modules`}>
          <ListItemText primary="Modules" />
        </ListItem>
        <ListItem button component={Link} to={`/course/${courseId}/quizzes`}>
          <ListItemText primary="Quizzes" />
        </ListItem>
        <ListItem button component={Link} to={`/course/${courseId}/assignments`}>
          <ListItemText primary="Assignments" />
        </ListItem>
        <ListItem button component={Link} to={`/course/${courseId}/students`}>
          <ListItemText primary="Students" />
        </ListItem>
      </List>
    </Paper>
  );
};

export default Sidebar;
