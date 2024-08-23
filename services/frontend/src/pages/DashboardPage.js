// src/pages/DashboardPage.js
import React, { useState, useEffect } from 'react';
import { Grid, Paper, Box, CircularProgress, Typography } from '@mui/material';
import Sidebar from '../components/Layout/Sidebar';
import CoursePage from './CoursePage';
import { fetchCoursesByTeacherId } from '../services/fakeApi';

const DashboardPage = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCoursesByTeacherId(teacherId);
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourse(data[0].course_id); // Set the first course as selected by default
        }
      } catch (error) {
        console.error('Failed to load courses:', error);
      } finally {
        setLoading(false);
      }
    };
    loadCourses();
  }, [teacherId]);

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Sidebar
          courseId={selectedCourse}
          onSectionChange={(section) => console.log(`Switched to section: ${section}`)}
        />
      </Grid>
      <Grid item xs={9}>
        <CoursePage courseId={selectedCourse} />
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
