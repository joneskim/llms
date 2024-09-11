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
import { fetchStudentByUniqueId, fetchCoursesByStudentId, fetchQuizzesByStudentInCourse } from '../services/fakeApi';

const StudentQuizAccessPage = () => {
  const [uniqueId, setUniqueId] = useState('');
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch student data using unique ID and match with enrolled courses
  const handleStudentLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const foundStudent = await fetchStudentByUniqueId(uniqueId);

      if (foundStudent) {
        setStudent(foundStudent);
        const coursesData = await fetchCoursesByStudentId(foundStudent.id); // Fetch only courses the student is enrolled in
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

  // Handle course selection and fetch quizzes for the selected course
  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const fetchedQuizzes = await fetchQuizzesByStudentInCourse(courseId); // Fetch quizzes for the student in the selected course
      setQuizzes(fetchedQuizzes);
    } catch (err) {
      setError('Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz selection and navigate to quiz page with student data
  const handleQuizSelect = (quiz) => {
    navigate(`/take-quiz/${quiz.id}`, { state: { quiz, student } });
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
        Access Your Quizzes
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
                {quizzes.map((quiz) => (
                  <TableRow key={quiz.id}>
                    <TableCell>{quiz.quiz_name}</TableCell>
                    <TableCell>{quiz.description}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleQuizSelect(quiz)}
                        sx={{ backgroundColor: '#1e1e2f', color: '#fff' }}
                      >
                        Start Quiz
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Container>
  );
};

export default StudentQuizAccessPage;
