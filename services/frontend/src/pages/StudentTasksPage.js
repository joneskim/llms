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
} from '@mui/material';
import {
  fetchStudentByUniqueId,
  fetchCoursesByStudentId,
  fetchQuizzesByStudentInCourse,
  fetchTasksByCourseId,
} from '../services/fakeApi';

const StudentTaskAccessPage = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleStudentLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const foundStudent = await fetchStudentByUniqueId(uniqueId);

      if (foundStudent) {
        setStudent(foundStudent);
        const coursesData = await fetchCoursesByStudentId(foundStudent.id);
        setCourses(coursesData);
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
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const fetchedQuizzes = await fetchQuizzesByStudentInCourse(courseId);
      const fetchedTasks = await fetchTasksByCourseId(courseId, student.id);
      setQuizzes(Array.isArray(fetchedQuizzes) ? fetchedQuizzes : []);
      setTasks(Array.isArray(fetchedTasks) ? fetchedTasks : []);
    } catch (err) {
      setError('Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleTaskSelect = (task, type) => {
    if (type === 'quiz') {
      navigate(`/take-quiz/${task.id}`, { state: { task, student } });
    } else if (type === 'assignment') {
      navigate(`/view-assignment/${task.id}`, { state: { task, student } });
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

      {student && !selectedCourse && (
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
          <Typography variant="h6" mt={3} mb={2}>
            Available Quizzes
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Quiz Name</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <TableRow key={quiz.id}>
                      <TableCell>{quiz.quiz_name}</TableCell>
                      <TableCell>{quiz.description}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleTaskSelect(quiz, 'quiz')}
                          sx={{ backgroundColor: '#1e1e2f', color: '#fff' }}
                        >
                          Start Quiz
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} sx={{ textAlign: 'center', padding: '1rem' }}>
                      No quizzes available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

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
                      <TableCell>{task.task_name}</TableCell>
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
                  <TableRow>
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
    </Container>
  );
};

export default StudentTaskAccessPage;
