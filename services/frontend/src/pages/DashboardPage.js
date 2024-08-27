import React, { useState, useEffect } from 'react';
import { Grid, Box, CircularProgress, Typography, Button } from '@mui/material';
import Sidebar from '../components/Layout/Sidebar';
import { fetchCoursesByTeacherId } from '../services/fakeApi';
import { useNavigate } from 'react-router-dom';

const DashboardPage = ({ teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

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
        <Box>
          {courses.map(course => (
            <Button
              key={course.course_id}
              variant="outlined"
              onClick={() => handleCourseClick(course.course_id)}
              sx={{ mb: 1 }}
            >
              {course.course_name}
            </Button>
          ))}
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
