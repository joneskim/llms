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
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchQuizzesByModuleId,
  fetchAssignmentsByModuleId,
} from '../../services/fakeApi';

const CourseManagement = ({ onCourseSelect, teacherId, onLogout }) => {
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]); // Events array for calendar events
  const navigate = useNavigate();

  useEffect(() => {
    const loadCoursesAndEvents = async () => {
      try {
        // Fetch all courses for the teacher
        const coursesData = await fetchCoursesByTeacherId(teacherId);
        setCourses(coursesData);

        const allEvents = [];
        const modulesPromises = coursesData.map(course => fetchModulesByCourseId(course.id));
        const modulesData = await Promise.all(modulesPromises);

        for (const [courseIndex, courseModules] of modulesData.entries()) {
          const course = coursesData[courseIndex];

          // Fetch all quizzes and assignments for the course's modules
          const quizzesPromises = courseModules.map(module => fetchQuizzesByModuleId(module.id));
          const assignmentsPromises = courseModules.map(module => fetchAssignmentsByModuleId(course.id, module.id));

          const [quizzesData, assignmentsData] = await Promise.all([
            Promise.all(quizzesPromises),
            Promise.all(assignmentsPromises)
          ]);

          // Flatten arrays and create events
          quizzesData.flat().forEach(quiz => {
            allEvents.push({
              title: `Quiz: ${quiz.quiz_name}`,
              start: quiz.startDate, // Use actual start date
              end: quiz.dueDate, // Use actual due date
              color: '#3e95cd',
            });
          });

          assignmentsData.flat().forEach(assignment => {
            allEvents.push({
              title: `Assignment: ${assignment.assignment_name}`,
              start: assignment.startDate, // Use actual start date
              end: assignment.dueDate, // Use actual due date
              color: '#ffa726',
            });
          });
        }

        setEvents(allEvents); // Set the events state with all the collected events
      } catch (err) {
        setError('Failed to load courses.');
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCoursesAndEvents();
  }, [teacherId]);

  const handleCourseSelect = (courseId) => {
    onCourseSelect(courseId);
    navigate(`/course/${courseId}/overview`, { state: { courseId } });
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_id');
    onLogout();
    navigate('/login');
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
    <Box padding={3} sx={{ backgroundColor: '#ffffff', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" sx={{ fontFamily: 'Roboto, sans-serif', fontWeight: 'bold' }}>
          My Courses
        </Typography>
        <Button
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{ color: '#1e1e2f', borderColor: '#1e1e2f' }}
        >
          Logout
        </Button>
      </Box>

      <Grid container spacing={4} mb={4}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card
              elevation={6}
              sx={{
                backgroundColor: '#ffffff',
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
              <Box sx={{ backgroundColor: '#1e1e2f', padding: '20px 16px', textAlign: 'center', color: '#ffffff' }}>
                <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: '600', marginTop: '10px' }}>
                  {course.course_name}
                </Typography>
              </Box>
              <CardContent sx={{ textAlign: 'center', padding: '24px 16px' }}>
                <Typography variant="body2" sx={{ fontFamily: 'Roboto, sans-serif', color: '#333', marginTop: '8px' }}>
                  {course.description || 'No description available'}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', paddingBottom: 3 }}>
                <Button
                  size="medium"
                  variant="contained"
                  color="primary"
                  onClick={() => handleCourseSelect(course.id)}
                  sx={{
                    backgroundColor: '#1e1e2f',
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

      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#2a2a3b', marginBottom: '1.5rem' }}>
        Upcoming Events
      </Typography>
      <Box
        sx={{
          backgroundColor: '#f7f9fc',
          borderRadius: '8px',
          padding: '1rem',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          border: '1px solid #ddd',
        }}
      >
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events} // Use the events state here
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          height="auto"
          contentHeight="auto"
          eventDisplay="block"
          eventColor="#3e95cd"
          dayMaxEvents={true}
          eventBackgroundColor="#f3f4f6"
          eventBorderColor="#ddd"
          eventTextColor="#333"
        />
      </Box>
    </Box>
  );
};

export default CourseManagement;
