import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
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
} from '@mui/material';
import { fetchStudentsByCourseId } from '../services/fakeApi';

const StudentsPage = () => {
  const { courseId } = useParams();
  const [students, setStudents] = useState([]);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const studentsData = await fetchStudentsByCourseId(courseId);
        setStudents(studentsData);
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    loadStudents();
  }, [courseId]);

  const handleStudentClick = (studentId) => {
    console.log('Student ID:', studentId);
    console.log('Course ID:', Number(courseId));
    
    navigate(`/course/${Number(courseId)}/students/${studentId}/quizzes`); // Navigate to the quiz result page
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={3}>
        Students Enrolled in Course
      </Typography>

      {students.length === 0 ? (
        <Typography variant="body1" color="#2a2a3b">
          No students are currently enrolled in this course.
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
                  Name
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
                  Email
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => (
                <TableRow 
                  key={student.id} 
                  sx={{ cursor: 'pointer' }} 
                  onClick={() => handleStudentClick(student.id)} // Make row clickable
                >
                  <TableCell sx={{ color: '#2a2a3b', padding: '16px' }}>{student.name}</TableCell>
                  <TableCell sx={{ color: '#2a2a3b', padding: '16px' }}>{student.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default StudentsPage;
