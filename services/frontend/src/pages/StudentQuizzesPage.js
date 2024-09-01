import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { fetchQuizzesByStudentInCourse, fetchStudentByUniqueId, fetchStudentById } from '../services/fakeApi'; // Use fetchStudentByUniqueId

const StudentQuizzesPage = () => {
  const { studentId, courseId } = useParams();
  const [quizzes, setQuizzes] = useState([]);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadQuizzesAndStudent = async () => {
      try {
        const quizzesData = await fetchQuizzesByStudentInCourse(Number(courseId), Number(studentId));
        const studentData = await fetchStudentById(Number(studentId)); // Use fetchStudentByUniqueId
        console.log('Quizzes:', quizzesData);
        console.log('Student:', studentData);
        setQuizzes(quizzesData);
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching quizzes or student:', error);
      }
    };

    loadQuizzesAndStudent();
  }, [courseId, studentId]);

  const handleQuizClick = (quizId) => {
    navigate(`/course/${Number(courseId)}/students/${Number(studentId)}/quizzes/${Number(quizId)}/results`, {
      state: { student }, // Pass the student object in the navigation state
    });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={3}>
        Quizzes Taken by Student
      </Typography>

      {quizzes.length === 0 ? (
        <Typography variant="body1" color="#2a2a3b">
          No quizzes taken by this student in this course.
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                <TableCell
                  sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderBottom: 'none',
                    padding: '16px',
                  }}
                >
                  Quiz Name
                </TableCell>
                <TableCell
                  sx={{
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '1.1rem',
                    borderBottom: 'none',
                    padding: '16px',
                  }}
                >
                  Score
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quizzes.map((quiz) => (
                <TableRow 
                  key={quiz.id} 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => handleQuizClick(quiz.id)} // Navigate to the quiz result page
                >
                  <TableCell sx={{ color: '#2a2a3b', padding: '16px' }}>{quiz.quiz_name}</TableCell>
                  <TableCell sx={{ color: '#2a2a3b', padding: '16px' }}>{quiz.score}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StudentQuizzesPage;
