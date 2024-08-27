import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  CircularProgress,
  Typography,
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
} from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { fetchCoursesByTeacherId } from '../../services/fakeApi';

const CourseManagement = ({ onCourseSelect, teacherId, onLogout }) => {
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
    navigate(`/course/${courseId}/overview`);
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_id');
    onLogout();
    navigate('/login');
  };

  if (loadingCourses) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#ffffff', color: '#333' }}  // Full white background with dark text
      >
        <CircularProgress />
        <Typography mt={2}>Loading courses...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{ backgroundColor: '#ffffff', color: '#333' }}  // Full white background with dark text
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      padding={3}
      sx={{
        backgroundColor: '#ffffff',  // Full white background
        minHeight: '100vh',
        color: '#333',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="div" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
          My Courses
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ color: '#1e1e2f', borderColor: '#1e1e2f' }}  // Button color matches the dark theme
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={4}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.course_id}>
            <Card
              elevation={6}
              sx={{
                backgroundColor: '#ffffff',  // White background for the card
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  transform: 'translateY(-10px)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <Box
                sx={{
                  backgroundColor: '#1e1e2f',  // Match navbar color for the top part
                  padding: '20px 16px',
                  textAlign: 'center',
                  color: '#ffffff',  // White text for contrast
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600', marginTop: '10px' }}
                >
                  {course.course_name}
                </Typography>
              </Box>
              <CardContent sx={{ textAlign: 'center', padding: '24px 16px' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'Roboto, sans-serif',
                    color: '#333',  // Dark text for readability
                    marginTop: '8px',
                  }}
                >
                  {course.course_description || 'No description available'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => handleCourseSelect(course.course_id)}
                  sx={{
                    backgroundColor: '#1e1e2f',  // Match navbar color
                    borderRadius: '10px',
                    padding: '10px 28px',
                    textTransform: 'none',
                    fontFamily: 'Poppins, sans-serif',
                    fontWeight: '500',
                    '&:hover': {
                      backgroundColor: '#115293',
                    },
                  }}
                >
                  Select Course
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CourseManagement;
