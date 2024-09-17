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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import LogoutIcon from '@mui/icons-material/Logout';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import {
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchQuizzesByModuleId,
  fetchAssignmentsByModuleId,
  fetchNotificationsByTeacherId,
} from '../../services/fakeApi';

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  borderRadius: theme.shape.borderRadius * 2,
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  marginTop: theme.spacing(8), // Add this to push the header below the navbar
}));


const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const CourseCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
  },
  boxShadow: 'none', // No shadows
  border: 'none',    // No borders
}));

const CalendarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: 'none', // No shadows
  border: 'none',    // No borders
}));

const CourseManagement = ({ onCourseSelect, teacherId, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    const loadCoursesAndEvents = async () => {
      if (!teacherId) return;

      try {
        const [coursesData, notificationsData] = await Promise.all([
          fetchCoursesByTeacherId(teacherId),
          fetchNotificationsByTeacherId(teacherId),
        ]);
        setCourses(coursesData);
        setNotifications(notificationsData);

        const allEvents = [];
        const deadlines = [];

        const modulesPromises = coursesData.map((course) =>
          fetchModulesByCourseId(course.id)
        );
        const modulesData = await Promise.all(modulesPromises);

        const quizzesAndAssignmentsPromises = modulesData.map((courseModules) => {
          const quizzesPromises = courseModules.map((module) =>
            fetchQuizzesByModuleId(module.id)
          );
          const assignmentsPromises = courseModules.map((module) =>
            fetchAssignmentsByModuleId(module.id)
          );
          return Promise.all([
            Promise.all(quizzesPromises),
            Promise.all(assignmentsPromises),
          ]);
        });

        const quizzesAndAssignmentsData = await Promise.all(quizzesAndAssignmentsPromises);

        quizzesAndAssignmentsData.forEach(([quizzesData, assignmentsData], courseIndex) => {
          const course = coursesData[courseIndex];
          const courseName = course.course_name;

          quizzesData.flat().forEach((quiz) => {
            allEvents.push({
              title: `Quiz: ${quiz.quiz_name}`,
              start: quiz.start_date,
              end: quiz.due_date,
              color: theme.palette.info.main,
              textColor: theme.palette.getContrastText(theme.palette.info.main),
              extendedProps: {
                type: 'Quiz',
                course: courseName,
              },
            });
            deadlines.push({
              title: `Quiz: ${quiz.quiz_name}`,
              dueDate: quiz.due_date,
              type: 'Quiz',
              course: courseName,
            });
          });

          assignmentsData.flat().forEach((assignment) => {
            allEvents.push({
              title: `Assignment: ${assignment.assignment_name}`,
              start: assignment.start_date,
              end: assignment.due_date,
              color: theme.palette.success.main,
              textColor: theme.palette.getContrastText(theme.palette.success.main),
              extendedProps: {
                type: 'Assignment',
                course: courseName,
              },
            });
            deadlines.push({
              title: `Assignment: ${assignment.assignment_name}`,
              dueDate: assignment.due_date,
              type: 'Assignment',
              course: courseName,
            });
          });
        });

        deadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setUpcomingDeadlines(deadlines);

        setEvents(allEvents);
      } catch (err) {
        console.error('Error loading courses and events:', err);
        setError('Failed to load courses.');
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCoursesAndEvents();
  }, [teacherId, theme.palette]);

  const handleCourseSelect = (courseId, courseName) => {
    onCourseSelect(courseId);

    localStorage.setItem('selectedCourseId', courseId);
    localStorage.setItem('selectedCourseName', courseName);

    navigate(`/course/${courseId}/overview`, { state: { courseId, courseName } });
  };

  if (loadingCourses) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
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
        minHeight="80vh"
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <StyledContainer>
      {/* Header */}
      <Header>
        
      </Header>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Courses Grid */}
          <Box mb={4}>
            <SectionTitle variant="h6">My Courses</SectionTitle>
            <Grid container spacing={4}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} key={course.id}>
                  <CourseCard>
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        padding: theme.spacing(2),
                        textAlign: 'center',
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {course.course_name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ textAlign: 'center', padding: theme.spacing(2) }}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, minHeight: '60px' }}
                      >
                        {course.description || 'No description available'}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', paddingBottom: theme.spacing(2) }}>
                      <Button
                        size="medium"
                        variant="contained"
                        color="secondary"
                        onClick={() => handleCourseSelect(course.id, course.course_name)}
                        sx={{
                          borderRadius: theme.shape.borderRadius,
                          textTransform: 'none',
                          fontWeight: 500,
                        }}
                      >
                        Select Course
                      </Button>
                    </CardActions>
                  </CourseCard>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Calendar */}
          <Box mb={4}>
            <SectionTitle variant="h6">Calendar</SectionTitle>
            <CalendarContainer>
              <FullCalendar
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: '',
                }}
                height="auto"
                contentHeight="auto"
                eventDisplay="block"
                dayMaxEvents={true}
                eventTextColor={theme.palette.getContrastText(theme.palette.background.paper)}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: false }}
              />
            </CalendarContainer>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Notifications */}
          <Box mb={4}>
            <SectionTitle variant="h6">Notifications</SectionTitle>
            <Paper
              sx={{
                padding: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
                boxShadow: 'none', // No shadows
                border: 'none',    // No borders
              }}
            >
              {notifications.length > 0 ? (
                <List>
                  {notifications.map((notification) => (
                    <ListItem key={notification.id}>
                      <ListItemIcon>
                        <NotificationsActiveIcon color="warning" />
                      </ListItemIcon>
                      <ListItemText
                        primary={notification.message}
                        secondary={new Date(notification.date).toLocaleString()}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No new notifications.</Typography>
              )}
            </Paper>
          </Box>

          {/* Upcoming Deadlines */}
          <Box mb={4}>
            <SectionTitle variant="h6">Upcoming Deadlines</SectionTitle>
            <Paper
              sx={{
                padding: theme.spacing(2),
                backgroundColor: theme.palette.background.paper,
                boxShadow: 'none', // No shadows
                border: 'none',    // No borders
              }}
            >
              {upcomingDeadlines.length > 0 ? (
                <List>
                  {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {deadline.type === 'Quiz' ? (
                          <QuizIcon color="info" />
                        ) : (
                          <AssignmentIcon color="success" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={deadline.title}
                        secondary={`Due: ${new Date(deadline.dueDate).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2">No upcoming deadlines.</Typography>
              )}
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default CourseManagement;
