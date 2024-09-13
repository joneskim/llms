import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Avatar,
  Divider,
  IconButton,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { fetchQuizzesByStudentInCourse, fetchStudentById } from '../services/fakeApi';

const StudentQuizzesPage = () => {
  const { studentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();

  const courseId = state?.courseId || localStorage.getItem('selectedCourseId');
  const courseName = state?.courseName || localStorage.getItem('selectedCourseName');

  const [quizzes, setQuizzes] = useState([]);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const loadQuizzesAndStudent = async () => {
      try {
        const quizzesData = await fetchQuizzesByStudentInCourse(courseId, studentId);
        const studentData = await fetchStudentById(studentId);
        setQuizzes(quizzesData || []); // Ensure quizzes is an array
        setStudent(studentData || {});
      } catch (error) {
        console.error('Error fetching quizzes or student:', error);
      }
    };

    loadQuizzesAndStudent();
  }, [courseId, studentId]);

  const handleQuizClick = (quizId) => {
    navigate(`/course/${courseId}/students/${studentId}/quizzes/${quizId}/results`, {
      state: { student, courseName },
    });
  };

  const handlePrint = () => {
    const printContent = componentRef.current;
    const WindowPrint = window.open('', '', 'width=900,height=650');
    WindowPrint.document.write('<html><head><title>Print Quizzes</title>');
    WindowPrint.document.write('<style>body{font-family: Arial, sans-serif;}</style></head><body>');
    WindowPrint.document.write(printContent.innerHTML);
    WindowPrint.document.write('</body></html>');
    WindowPrint.document.close();
    WindowPrint.focus();
    WindowPrint.print();
    WindowPrint.close();
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Box ref={componentRef}>
        {student && (
          <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <Avatar sx={{ width: 64, height: 64, marginRight: '16px', backgroundColor: '#3498db' }}>
                {student.name[0]}
              </Avatar>
              <Box>
                <Typography variant="h5" color="#2a2a3b" fontWeight="bold">
                  {student.name}
                </Typography>
                <Typography variant="subtitle1" color="#7f8c8d">
                  Student ID: {student.uniqueId}
                </Typography>
                <Typography variant="subtitle1" color="#7f8c8d">
                  Course: {courseName}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handlePrint} sx={{ color: '#2a2a3b' }}>
              <PrintIcon />
            </IconButton>
          </Box>
        )}

        <Divider sx={{ marginBottom: '2rem' }} />

        <Typography variant="h6" color="#34495e" fontWeight="bold" mb={3}>
          Quizzes Taken in {courseName} Course
        </Typography>

        {quizzes.length === 0 ? (
          <Typography variant="body1" color="#7f8c8d">
            No quizzes have been taken by this student in this course.
          </Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: '8px',
              overflow: 'hidden',
              border: '1px solid #ddd',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#ecf0f1' }}>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      padding: '16px',
                    }}
                  >
                    Quiz Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      padding: '16px',
                    }}
                  >
                    Score
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      padding: '16px',
                    }}
                  >
                    Percentage Score
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {quizzes.map((quiz) => (
                  <TableRow
                    key={quiz.quizId}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': { backgroundColor: '#f2f4f7' },
                      transition: 'background-color 0.3s ease-in-out',
                    }}
                    onClick={() => handleQuizClick(quiz.quizId)}
                  >
                    <TableCell sx={{ padding: '16px', borderBottom: '1px solid #e0e0e0', color: '#2c3e50' }}>
                      {quiz.quizName}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '16px',
                        borderBottom: '1px solid #e0e0e0',
                        color: quiz.score >= 50 ? '#27ae60' : '#e74c3c',
                      }}
                    >
                      {quiz.score !== null ? `${quiz.score}` : 'No score available'}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: '16px',
                        borderBottom: '1px solid #e0e0e0',
                        color: quiz.percentageScore >= 50 ? '#27ae60' : '#e74c3c',
                      }}
                    >
                      {quiz.percentageScore}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Container>
  );
};

export default StudentQuizzesPage;
