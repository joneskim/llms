import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Button,
} from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import {
  StyledContainer,
  Header,
  Title,
  SearchField,
  BackButton,
  ErrorBox,
} from './design/StyledComponents';
import { fetchStudentsByCourseId, fetchQuizzesByStudentInCourse, addStudent } from '../services/fakeApi';
import { styled } from '@mui/material/styles'; // Ensure styled is imported
import AddStudentModal from './AddStudentModal';

// Additional Styled Components specific to StudentsPage
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

const StudentsPage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [quizResults, setQuizResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setModalOpen] = useState(false);

  // Fetch students and their quiz results
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const studentsData = await fetchStudentsByCourseId(courseId);
        setStudents(studentsData);

        const quizPromises = studentsData.map((student) =>
          fetchQuizzesByStudentInCourse(courseId, student.id)
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
  }, [courseId]);

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setStudents([]);
    setQuizResults({});
    // Re-fetch data by calling useEffect
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const studentsData = await fetchStudentsByCourseId(courseId);
        setStudents(studentsData);

        const quizPromises = studentsData.map((student) =>
          fetchQuizzesByStudentInCourse(courseId, student.id)
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

  const handleStudentClick = (studentId) => {
    navigate(`/course/${courseId}/students/${studentId}/quizzes`);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.uniqueId.toLowerCase().includes(searchTerm.toLowerCase()) // Allow search by unique ID
    );
  }, [students, searchTerm]);

  const calculateAverageScore = (studentId) => {
    const quizzes = quizResults[studentId] || [];
    if (quizzes.length === 0) return 'N/A';
    const total = quizzes.reduce((acc, quiz) => acc + (quiz.score || 0), 0);
    return (total / quizzes.length).toFixed(2);
  };

  const handleKeyPress = (e, studentId) => {
    if (e.key === 'Enter') {
      handleStudentClick(studentId);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleAddStudent = async (newStudent) => {
    try {
      // Simulate adding the student to the database (you should replace this with a real API call)
      await addStudent(courseId, newStudent);

      // Update the state with the new student
      setStudents([...students, newStudent]);
    } catch (error) {
      console.error('Error adding student:', error);
      setError('Unable to add student. Please try again.');
    }
  };

  if (loading) {
    return (
      <ErrorBox>
        <CircularProgress color="primary" />
      </ErrorBox>
    );
  }

  if (error) {
    return (
      <ErrorBox>
        <Alert
          severity="error"
          action={
            <IconButton aria-label="refresh" color="inherit" size="small" onClick={handleRefresh}>
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </ErrorBox>
    );
  }

  return (
    <StyledContainer>
      {/* Header Section */}
      <Header>
        <BackButton onClick={handleBack} aria-label="Go back">
          <ArrowBackIosNewIcon />
        </BackButton>
        <Title variant="h5">Students Enrolled</Title>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Add Student
        </Button>
      </Header>

      {/* Search Bar */}
      <SearchField
        variant="outlined"
        placeholder="Search by name, email, or unique ID"
        value={searchTerm}
        onChange={handleSearchChange}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }}
        aria-label="Search students"
      />

      {/* Students Table */}
      {filteredStudents.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No students match your search criteria.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Unique ID</StyledTableCell>
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
                  <TableCell>{student.uniqueId}</TableCell>
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

      {/* Add Student Modal */}
      <AddStudentModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onAddStudent={handleAddStudent}
      />
    </StyledContainer>
  );
};

export default StudentsPage;
