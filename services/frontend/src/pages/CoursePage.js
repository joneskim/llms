// src/pages/CoursePage.js
import React from 'react';
import { useParams, Outlet, useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import Sidebar from '../components/Layout/Sidebar';
import CourseRoutes from './Routes'; // Import CourseRoutes

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/course-management');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ marginLeft: '250px', padding: '16px', width: '100%' }}>
        <Button variant="contained" onClick={handleBack} sx={{ mb: 2 }}>
          Back to Course Selection
        </Button>
        <h1>Course ID: {courseId}</h1>
        {/* Render nested routes */}
        <CourseRoutes />
      </Box>
    </Box>
  );
};

export default CoursePage;
