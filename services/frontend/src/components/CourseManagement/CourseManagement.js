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
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tooltip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  useMediaQuery,
  Button,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
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

// Styled Components

const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  paddingTop: theme.spacing(10),
  borderRadius: theme.shape.borderRadius * 2,
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(2),
}));

const CourseCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.default,
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'scale(1.03)',
    boxShadow: theme.shadows[5],
  },
  padding: theme.spacing(2),
}));

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1.2rem',
  marginBottom: theme.spacing(1),
}));

const CourseDescription = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
}));

const CalendarContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  boxShadow: theme.shadows[2],
}));

const NotificationPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const DeadlinePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
}));

const CourseManagement = ({ onCourseSelect, teacherId }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

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
              title: `📚 Quiz: ${quiz.quiz_name}`,
              start: quiz.start_date,
              end: quiz.due_date,
              color: theme.palette.info.main,
              textColor: theme.palette.getContrastText(theme.palette.info.main),
              extendedProps: {
                type: 'Quiz',
                course: courseName,
                details: quiz.description || 'No description provided.',
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
              title: `📖 Assignment: ${assignment.assignment_name}`,
              start: assignment.start_date,
              end: assignment.due_date,
              color: theme.palette.success.main,
              textColor: theme.palette.getContrastText(theme.palette.success.main),
              extendedProps: {
                type: 'Assignment',
                course: courseName,
                details: assignment.description || 'No description provided.',
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
        setError('Failed to load courses and events.');
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

  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const { type, course } = event.extendedProps;
    let icon;

    switch (type) {
      case 'Quiz':
        icon = <QuizIcon fontSize="small" />;
        break;
      case 'Assignment':
        icon = <AssignmentIcon fontSize="small" />;
        break;
      default:
        icon = <NotificationsActiveIcon fontSize="small" />;
    }

    return (
      <Tooltip title={`${type} - ${course}`}>
        <Box display="flex" alignItems="center">
          {icon}
          <Typography variant="caption" sx={{ marginLeft: '4px' }}>
            {event.title}
          </Typography>
        </Box>
      </Tooltip>
    );
  };

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
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
    <>
      {/* Topbar */}

      <StyledContainer>
        <Grid container spacing={4}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Courses Section */}
            <Box mb={4}>
              <SectionTitle variant="h6">My Courses</SectionTitle>
              <Grid container spacing={3}>
                {courses.map((course) => (
                  <Grid item xs={12} sm={6} key={course.id}>
                    <CourseCard onClick={() => handleCourseSelect(course.id, course.course_name)}>
                      <CardContent sx={{ textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            width: 56,
                            height: 56,
                            margin: '0 auto',
                            marginBottom: theme.spacing(2),
                            fontSize: '1.5rem',
                          }}
                        >
                          {course.course_name.charAt(0).toUpperCase()}
                        </Avatar>
                        <CourseTitle>{course.course_name}</CourseTitle>
                        <CourseDescription>
                          {course.description || 'No description available'}
                        </CourseDescription>
                      </CardContent>
                    </CourseCard>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Calendar Section */}
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
                  eventContent={renderEventContent} // Custom event rendering
                  eventClick={handleEventClick} // Handle event click
                />
              </CalendarContainer>
            </Box>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            {/* Notifications Section */}
            <Box mb={4}>
              <SectionTitle variant="h6">Notifications</SectionTitle>
              <NotificationPaper>
                {notifications.length > 0 ? (
                  <List>
                    {notifications.map((notification) => (
                      <ListItem key={notification.id} alignItems="flex-start">
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
              </NotificationPaper>
            </Box>

            {/* Upcoming Deadlines Section */}
            <Box mb={4}>
              <SectionTitle variant="h6">Upcoming Deadlines</SectionTitle>
              <DeadlinePaper>
                {upcomingDeadlines.length > 0 ? (
                  <List>
                    {upcomingDeadlines.slice(0, 5).map((deadline, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
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
                        {index < upcomingDeadlines.slice(0, 5).length - 1 && <Divider component="li" />}
                      </React.Fragment>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2">No upcoming deadlines.</Typography>
                )}
              </DeadlinePaper>
            </Box>
          </Grid>
        </Grid>
      </StyledContainer>

      {/* Event Details Modal */}
      <Dialog
        open={isModalOpen}
        onClose={handleModalClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="event-details-dialog-title"
      >
        <DialogTitle id="event-details-dialog-title">
          {selectedEvent ? selectedEvent.title : ''}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedEvent ? selectedEvent.extendedProps.details : ''}
          </DialogContentText>
          {selectedEvent && (
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary">
                <strong>Course:</strong> {selectedEvent.extendedProps.course}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Start:</strong> {new Date(selectedEvent.start).toLocaleString()}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <strong>Due:</strong> {new Date(selectedEvent.end).toLocaleString()}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CourseManagement;
