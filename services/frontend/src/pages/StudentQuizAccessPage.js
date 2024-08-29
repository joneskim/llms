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
import { fetchStudentsByCourseId, fetchCoursesByTeacherId, fetchQuizzesByModuleId } from '../services/fakeApi';

const StudentQuizAccessPage = () => {
  const [studentName, setStudentName] = useState('');
  const [student, setStudent] = useState(null);
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch students and match the entered student name with enrolled students
  const handleStudentLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const teacherId = 1; // Example ID, adjust as needed
      const coursesData = await fetchCoursesByTeacherId(teacherId);
      let foundStudent = null;

      for (const course of coursesData) {
        const students = await fetchStudentsByCourseId(course.id);
        const matchedStudent = students.find((s) => s.name.toLowerCase() === studentName.toLowerCase());
        if (matchedStudent) {
          foundStudent = matchedStudent;
          setCourses(coursesData);
          break;
        }
      }

      if (foundStudent) {
        setStudent(foundStudent);
      } else {
        setError('Student not found.');
      }
    } catch (err) {
      setError('Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  // Handle course selection
  const handleCourseSelect = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const fetchedQuizzes = await fetchQuizzesByModuleId(courseId); // Adjust to fetch quizzes for selected course
      setQuizzes(fetchedQuizzes);
    } catch (err) {
      setError('Failed to load quizzes.');
    } finally {
      setLoading(false);
    }
  };

  // Handle quiz selection and navigate to quiz page
  const handleQuizSelect = (quiz) => {
    navigate(`/take-quiz/${quiz.id}`, { state: { quiz } });
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
      }}
    >
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={2}>
        Access Your Quizzes
      </Typography>

      {!student && (
        <Box mb={3}>
          <TextField
            fullWidth
            label="Enter Your Unique ID (First Name)"
            variant="outlined"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
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
