import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, CardContent, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'react-router-dom';
import { fetchCoursesByTeacherId, fetchModulesByCourseId, fetchStudentsByCourseId } from '../services/fakeApi';

const OverviewPage = () => {
  const { courseId } = useParams(); // Get courseId from the route
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Assuming you already have the teacherId stored globally or in context
        const teacherId = 1; // Example teacherId, replace with actual logic
        const courses = await fetchCoursesByTeacherId(teacherId);
        const currentCourse = courses.find(course => course.course_id === parseInt(courseId));
        if (currentCourse) {
          setCourse(currentCourse);
          const loadedModules = await fetchModulesByCourseId(courseId);
          setModules(loadedModules);
          const loadedStudents = await fetchStudentsByCourseId(courseId);
          setStudents(loadedStudents);
        } else {
          setError('Course not found.');
        }
      } catch (err) {
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

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
        {course.course_name} Overview
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <CardContent>
              <Typography variant="h6" component="div">
                Modules
              </Typography>
              <Typography variant="h4" component="div">
                {modules.length}
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <CardContent>
              <Typography variant="h6" component="div">
                Students Enrolled
              </Typography>
              <Typography variant="h4" component="div">
                {students.length}
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Assignments
              </Typography>
              <Typography variant="h4" component="div">
                {modules.reduce((acc, mod) => acc + (mod.assignments ? mod.assignments.length : 0), 0)}
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3}>
            <CardContent>
              <Typography variant="h6" component="div">
                Total Quizzes
              </Typography>
              <Typography variant="h4" component="div">
                {modules.reduce((acc, mod) => acc + (mod.quizzes ? mod.quizzes.length : 0), 0)}
              </Typography>
            </CardContent>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OverviewPage;
