// src/pages/StudentsPage.js

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Box,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchStudentsByCourseId, fetchQuizzesByStudentInCourse } from '../services/fakeApi';

// Styled Components
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(2),
  backgroundColor: '#F9FAFB', // Light background to blend seamlessly
  borderRadius: theme.spacing(1),
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#E5E7EB', // Light gray for header
});

const StyledTableCell = styled(TableCell)({
  color: '#374151', // Darker gray for text
  fontWeight: '600',
});

const StyledTableRow = styled(TableRow)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F3F4F6', // Slight hover effect
  },
});

const SearchBox = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  backgroundColor: '#FFFFFF',
  borderRadius: theme.spacing(1),
}));

const ErrorBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  backgroundColor: '#F9FAFB',
});

const StudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch students and their quiz results
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch students
        const studentsData = await fetchStudentsByCourseId(courseId);
        setStudents(studentsData);

        // Fetch quizzes for all students in parallel
        const quizPromises = studentsData.map((student) =>
          fetchQuizzesByStudentInCourse(student.id, courseId)
        );
        const quizzesArray = await Promise.all(quizPromises);

        // Structure quiz results
        const results = {};
        quizzesArray.forEach((quizzes, index) => {
          results[studentsData[index].id] = quizzes;
        });
        setQuizResults(results);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to fetch student data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Handle refresh to refetch data
  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setStudents([]);
    setQuizResults({});
    // Re-fetch data
    const fetchData = async () => {
      try {
        const studentsData = await fetchStudentsByCourseId(courseId);
        setStudents(studentsData);

        const quizPromises = studentsData.map((student) =>
          fetchQuizzesByStudentInCourse(student.id, courseId)
        );
        const quizzesArray = await Promise.all(quizPromises);

        const results = {};
        quizzesArray.forEach((quizzes, index) => {
          results[studentsData[index].id] = quizzes;
        });
        setQuizResults(results);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Unable to fetch student data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  };

  // Handle student row click
  const handleStudentClick = (studentId) => {
    navigate(`/course/${courseId}/students/${studentId}/quizzes`);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filtered students based on search term
  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  // Calculate average score for a student
  const calculateAverageScore = (studentId) => {
    const quizzes = quizResults[studentId] || [];
    if (quizzes.length === 0) return 'N/A';
    const total = quizzes.reduce((acc, quiz) => acc + (quiz.score || 0), 0);
    return (total / quizzes.length).toFixed(2);
  };

  // Handle key press for accessibility
  const handleKeyPress = (e, studentId) => {
    if (e.key === 'Enter') {
      handleStudentClick(studentId);
    }
  };

  // Loading State
  if (loading) {
    return (
      <ErrorBox>
        <CircularProgress color="primary" />
      </ErrorBox>
    );
  }

  // Error State
  if (error) {
    return (
      <ErrorBox>
        <Alert severity="error" action={
          <IconButton aria-label="refresh" color="inherit" size="small" onClick={handleRefresh}>
            <RefreshIcon fontSize="inherit" />
          </IconButton>
        }>
          {error}
        </Alert>
      </ErrorBox>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
        <Typography variant="h5" color="#374151" fontWeight="bold">
          Students Enrolled
        </Typography>
        <IconButton onClick={handleRefresh} aria-label="Refresh Students">
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Search Bar */}
      <SearchBox
        variant="outlined"
        placeholder="Search by name or email"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Typography variant="body1" color="#374151">
          No students match your search criteria.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={0}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Quizzes Taken</StyledTableCell>
                <StyledTableCell>Average Score (%)</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <StyledTableRow
                  key={student.id}
                  onClick={() => handleStudentClick(student.id)}
                  onKeyPress={(e) => handleKeyPress(e, student.id)}
                  tabIndex={0}
                  aria-label={`View quizzes for ${student.name}`}
                >
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{quizResults[student.id]?.length || 0}</TableCell>
                  <TableCell>{calculateAverageScore(student.id)}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </StyledContainer>
  );
};

export default StudentsPage;
