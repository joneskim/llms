// src/components/CourseManagement/CourseManagement.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  styled,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School'; // Example icon
import { fetchCoursesByTeacherId } from '../../services/fakeApi'; // Ensure the path is correct

const StyledCard = styled(Card)(({ theme }) => ({
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.03)',
  },
  padding: theme.spacing(2),
  textAlign: 'center',
}));

const CourseManagement = ({ onCourseSelect, teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await fetchCoursesByTeacherId(teacherId);
        setCourses(data);
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoadingCourses(false);
      }
    };
    loadCourses();
  }, [teacherId]);

  const handleCourseSelect = (courseId) => {
    onCourseSelect(courseId);
    navigate(`/course/${courseId}/modules`); // Navigate to the modules section of the selected course
  };

  if (loadingCourses) {
    return (
      <Paper variant="outlined" sx={{ padding: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography mt={2}>Loading courses...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper variant="outlined" sx={{ padding: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.course_id}>
            <StyledCard variant="outlined" elevation={3}>
              <CardContent>
                <SchoolIcon sx={{ fontSize: 60, color: 'primary.main' }} />
                <Typography variant="h6" component="div" sx={{ mt: 2 }}>
                  {course.course_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {course.course_description || 'No description available'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={() => handleCourseSelect(course.course_id)}
                >
                  Select Course
                </Button>
              </CardActions>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseManagement;
