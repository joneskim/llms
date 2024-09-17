import React, { useState, useEffect } from 'react';
import {
  Grid,
  Box,
  CircularProgress,
  Typography,
  Button,
  IconButton,
  Paper,
  Toolbar,
  AppBar,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Sidebar from '../components/Layout/Sidebar';
import { fetchCoursesByTeacherId } from '../services/fakeApi';
import { useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: 'none',
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const DashboardContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
}));

const CourseButton = styled(Button)(({ theme }) => ({
  justifyContent: 'flex-start',
  textTransform: 'none',
  padding: theme.spacing(1.5),
  marginBottom: theme.spacing(1),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

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
          setSelectedCourse(data[0].course_id);
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
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
      >
        <CircularProgress />
        <Typography mt={2}>Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* AppBar */}
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <Grid container>
        <Grid item xs={12} md={3}>
          <Sidebar
            courseId={selectedCourse}
            onSectionChange={(section) => console.log(`Switched to section: ${section}`)}
          />
        </Grid>
        <Grid item xs={12} md={9}>
          <DashboardContainer>
            <Typography variant="h5" gutterBottom>
              My Courses
            </Typography>
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseButton
                  key={course.course_id}
                  onClick={() => handleCourseClick(course.course_id)}
                  aria-label={`Open course ${course.course_name}`}
                  fullWidth
                >
                  {course.course_name}
                </CourseButton>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No courses available.
              </Typography>
            )}
          </DashboardContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
