// components/CourseManagement.jsx
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
  useTheme,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
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
} from '../../services/fakeApi'; // Adjust the import path as needed

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
        // Fetch courses
        const coursesData = await fetchCoursesByTeacherId(teacherId);
        setCourses(coursesData);

        // Fetch notifications
        const notificationsData = await fetchNotificationsByTeacherId(teacherId);
        setNotifications(notificationsData);

        const allEvents = [];
        const deadlines = [];

        // Fetch modules for each course
        const modulesPromises = coursesData.map((course) =>
          fetchModulesByCourseId(course.id)
        );
        const modulesData = await Promise.all(modulesPromises);

        // Fetch quizzes and assignments for each module
        for (const [courseIndex, courseModules] of modulesData.entries()) {
          const course = coursesData[courseIndex];

          const quizzesPromises = courseModules.map((module) =>
            fetchQuizzesByModuleId(module.id)
          );
          const assignmentsPromises = courseModules.map((module) =>
            fetchAssignmentsByModuleId(module.id)
          );

          const [quizzesData, assignmentsData] = await Promise.all([
            Promise.all(quizzesPromises),
            Promise.all(assignmentsPromises),
          ]);

          // Process quizzes
          quizzesData.flat().forEach((quiz) => {
            allEvents.push({
              title: `Quiz: ${quiz.quiz_name}`,
              start: quiz.start_date,
              end: quiz.due_date,
              color: theme.palette.primary.main,
              extendedProps: {
                type: 'Quiz',
                course: course.course_name,
              },
            });
            deadlines.push({
              title: `Quiz: ${quiz.quiz_name}`,
              dueDate: quiz.due_date,
              type: 'Quiz',
              course: course.course_name,
            });
          });

          // Process assignments
          assignmentsData.flat().forEach((assignment) => {
            allEvents.push({
              title: `Assignment: ${assignment.assignment_name}`,
              start: assignment.start_date,
              end: assignment.due_date,
              color: theme.palette.secondary.main,
              extendedProps: {
                type: 'Assignment',
                course: course.course_name,
              },
            });
            deadlines.push({
              title: `Assignment: ${assignment.assignment_name}`,
              dueDate: assignment.due_date,
              type: 'Assignment',
              course: course.course_name,
            });
          });
        }

        // Sort deadlines by due date
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
  }, [teacherId, theme.palette.primary.main, theme.palette.secondary.main]);

  const handleCourseSelect = (courseId, courseName) => {
    onCourseSelect(courseId);

    localStorage.setItem('selectedCourseId', courseId);
    localStorage.setItem('selectedCourseName', courseName);

    navigate(`/course/${courseId}/overview`, { state: { courseId, courseName } });
  };

  if (loadingCourses) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
        <Typography mt={2}>Loading courses...</Typography>
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
    <Box padding={3} sx={{ backgroundColor: theme.palette.background.default, minHeight: '100vh' }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Dashboard
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          {/* Courses Grid */}
          <Box mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              My Courses
            </Typography>
            <Grid container spacing={4}>
              {courses.map((course) => (
                <Grid item xs={12} sm={6} key={course.id}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        padding: '16px',
                        textAlign: 'center',
                        color: theme.palette.primary.contrastText,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: '600' }}>
                        {course.course_name}
                      </Typography>
                    </Box>
                    <CardContent sx={{ textAlign: 'center', padding: '16px' }}>
                      <Typography
                        variant="body2"
                        sx={{ color: theme.palette.text.secondary, minHeight: '60px' }}
                      >
                        {course.description || 'No description available'}
                      </Typography>5
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'center', paddingBottom: 2 }}>
                      <Button
                        size="medium"
                        variant="contained"
                        color="primary"
                        onClick={() => handleCourseSelect(course.id, course.course_name)}
                        sx={{
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: '500',
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

          {/* Calendar */}
          <Box mb={4}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 2 }}
            >
              Calendar
            </Typography>
            <Box
              sx={{
                backgroundColor: theme.palette.background.paper,
                borderRadius: '8px',
                padding: '1rem',
                boxShadow: theme.shadows[2],
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
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
              />
            </Box>
          </Box>
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          {/* Notifications */}
          <Box mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Notifications
            </Typography>
            <Paper
              elevation={3}
              sx={{
                padding: '1rem',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '8px',
              }}
            >
              {notifications.length > 0 ? (
                <List>
                  {notifications.map((notification) => (
                    <ListItem key={notification.id}>
                      <ListItemIcon>
                        <NotificationsActiveIcon color="primary" />
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
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
              Upcoming Deadlines
            </Typography>
            <Paper
              elevation={3}
              sx={{
                padding: '1rem',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '8px',
              }}
            >
              {upcomingDeadlines.length > 0 ? (
                <List>
                  {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        {deadline.type === 'Quiz' ? (
                          <QuizIcon color="secondary" />
                        ) : (
                          <AssignmentIcon color="primary" />
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
    </Box>
  );
};

export default CourseManagement;
