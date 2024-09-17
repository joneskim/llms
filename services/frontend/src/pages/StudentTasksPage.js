import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {
  fetchStudentByUniqueId,
  fetchCoursesByStudentId,
  fetchQuizzesByStudentInCourse,
  fetchTasksByCourseId,
  fetchNotificationsByStudentId,
  markNotificationAsRead,
} from '../services/fakeApi';

const StudentTaskAccessPage = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch notifications when the student logs in
  useEffect(() => {
    if (student) {
      fetchNotifications();
    }
  }, [student]);

  const fetchNotifications = async () => {
    try {
      const notificationsData = await fetchNotificationsByStudentId(student.id);
      setNotifications(notificationsData);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleStudentLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const foundStudent = await fetchStudentByUniqueId(uniqueId);

      if (foundStudent) {
        setStudent(foundStudent);
        const coursesData = await fetchCoursesByStudentId(foundStudent.id);
        setCourses(coursesData);
        fetchNotifications(); // Fetch notifications after login
      } else {
        setError('Student not found.');
      }
    } catch (err) {
      setError('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = async (courseId) => {
    if (!student || !student.id) {
      setError('Student information is missing.');
      return;
    }
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const fetchedQuizzes = await fetchQuizzesByStudentInCourse(courseId, student.id);
      const fetchedTasks = await fetchTasksByCourseId(courseId);
      setQuizzes(Array.isArray(fetchedQuizzes) ? fetchedQuizzes : []);
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      setError('Failed to load tasks and quizzes.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (task, type) => {
    if (type === 'quiz') {
      navigate(`/take-quiz/${task.quizId}`, { state: { task, student } });
    } else if (type === 'assignment') {
      navigate(`/view-assignment/${task.id}`, { state: { task, student } });
    }
  };

  const handleMarkNotificationAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(notifications.filter(n => n.id !== notificationId));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: '#f8f9fa',
      }}
    >
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={2}>
        Access Your Tasks
      </Typography>

      {!student && (
        <Box mb={3}>
          <TextField
            fullWidth
            label="Enter Your Unique Student ID"
            variant="outlined"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            sx={{ marginBottom: '1rem', backgroundColor: '#fff' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleStudentLogin}
            sx={{ backgroundColor: '#34495e', color: 'white' }}
          >
            Submit
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ marginBottom: 3 }}>
          {error}
        </Alert>
      )}

      {student && (
        <>
          {/* Notifications Section */}
          <Box mb={3}>
            <Typography variant="h6" mb={2}>
              Notifications
            </Typography>
            {notifications.length > 0 ? (
              <Box sx={{ marginBottom: 3 }}>
                {notifications.map((notification) => (
                  <Alert
                    key={notification.id}
                    severity="info"
                    action={
                      <IconButton
                        size="small"
                        onClick={() => handleMarkNotificationAsRead(notification.id)}
                      >
                        <CloseIcon fontSize="inherit" />
                      </IconButton>
                    }
                    sx={{ marginBottom: 2 }}
                  >
                    {notification.message}
                  </Alert>
                ))}
              </Box>
            ) : (
              <Alert severity="info">No new notifications.</Alert>
            )}
          </Box>

          {!selectedCourse && (
            <>
              <Typography variant="h6" mb={2}>
                Select a Course
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Course Name</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {courses.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell>{course.course_name}</TableCell>
                        <TableCell>{course.description}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCourseSelect(course.id)}
                            sx={{ backgroundColor: '#1e1e2f', color: '#fff' }}
                          >
                            Select
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}

          {selectedCourse && (
            <>
              {/* Quizzes Table */}
              <Typography variant="h6" mt={3} mb={2}>
                Available Quizzes
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Quiz Name</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {quizzes.length > 0 ? (
                      quizzes.map((quiz) => (
                        <TableRow key={quiz.quizId}>
                          <TableCell>{quiz.quizName}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleTaskSelect(quiz, 'quiz')}
                              sx={{ backgroundColor: '#1e1e2f', color: '#fff' }}
                            >
                              {quiz.score !== null ? 'Retake Quiz' : 'Start Quiz'}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key="no-quizzes">
                        <TableCell colSpan={2} sx={{ textAlign: 'center', padding: '1rem' }}>
                          No quizzes available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Tasks Table */}
              <Typography variant="h6" mt={3} mb={2}>
                Available Tasks
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Task Name</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description</TableCell>
                      <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tasks.length > 0 ? (
                      tasks.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.taskName}</TableCell>
                          <TableCell>{task.description}</TableCell>
                          <TableCell>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleTaskSelect(task, 'assignment')}
                              sx={{ backgroundColor: '#1e1e2f', color: '#fff' }}
                            >
                              View Task
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow key="no-tasks">
                        <TableCell colSpan={3} sx={{ textAlign: 'center', padding: '1rem' }}>
                          No tasks available.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default StudentTaskAccessPage;
