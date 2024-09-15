// StudentQuizzesPage.jsx

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
  CircularProgress,
  Alert,
  Pagination,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from 'react-to-print';
import { fetchQuizzesByStudentInCourse, fetchStudentById } from '../services/fakeApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

// Sub-component to display student information
const StudentInfo = ({ student, courseName, handlePrint }) => (
  <Box mb={4} display="flex" alignItems="center" justifyContent="space-between">
    <Box display="flex" alignItems="center">
      <Avatar
        sx={{
          width: 64,
          height: 64,
          marginRight: '16px',
          backgroundColor: '#3498db',
          fontSize: '2rem',
        }}
        aria-label="student-avatar"
      >
        {student.name.charAt(0).toUpperCase()}
      </Avatar>
      <Box>
        <Typography variant="h5" color="text.primary" fontWeight="bold">
          {student.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Student ID: {student.uniqueId}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Course: {courseName}
        </Typography>
      </Box>
    </Box>
    <IconButton onClick={handlePrint} aria-label="print-quizzes" color="primary">
      <PrintIcon />
    </IconButton>
  </Box>
);

// Sub-component to display quizzes in a table with pagination and sorting
const QuizzesTable = ({ quizzes, onQuizClick }) => {
  const [page, setPage] = useState(1);
  const quizzesPerPage = 10;
  const [sortedQuizzes, setSortedQuizzes] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'quizName', direction: 'asc' });

  useEffect(() => {
    let sortableQuizzes = [...quizzes];
    if (sortConfig !== null) {
      sortableQuizzes.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    setSortedQuizzes(sortableQuizzes);
  }, [quizzes, sortConfig]);

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Calculate the quizzes to display on the current page
  const indexOfLastQuiz = page * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = sortedQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(sortedQuizzes.length / quizzesPerPage);

  return (
    <Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid #ddd',
          marginBottom: '1rem',
        }}
      >
        <Table aria-label="quizzes-table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ecf0f1' }}>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '16px',
                  cursor: 'pointer',
                }}
                onClick={() => handleSort('quizName')}
              >
                Quiz Name {sortConfig.key === 'quizName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '16px',
                  cursor: 'pointer',
                }}
                align="right"
                onClick={() => handleSort('score')}
              >
                Score {sortConfig.key === 'score' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '16px',
                  cursor: 'pointer',
                }}
                align="right"
                onClick={() => handleSort('percentageScore')}
              >
                Percentage Score{' '}
                {sortConfig.key === 'percentageScore' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentQuizzes.map((quiz) => (
              <TableRow
                key={quiz.quizId}
                hover
                sx={{
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: '#f2f4f7' },
                  transition: 'background-color 0.3s ease-in-out',
                }}
                onClick={() => onQuizClick(quiz.quizId)}
                tabIndex={0}
                role="button"
                aria-label={`View results for ${quiz.quizName}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') onQuizClick(quiz.quizId);
                }}
              >
                <TableCell
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    color: 'text.primary',
                  }}
                >
                  {quiz.quizName}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    padding: '16px',
                    borderBottom: '1px solid #e0e0e0',
                    color: quiz.score >= 50 ? '#27ae60' : '#e74c3c',
                  }}
                >
                  {quiz.score !== null ? `${quiz.score}` : 'N/A'}
                </TableCell>
                <TableCell
                  align="right"
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
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination count={totalPages} page={page} onChange={handleChangePage} color="primary" />
        </Box>
      )}
    </Box>
  );
};

// Sub-component to display quiz scores in a bar chart
const QuizzesChart = ({ quizzes }) => {
  const chartData = quizzes.map((quiz) => ({
    name: quiz.quizName,
    score: quiz.score,
  }));

  return (
    <Box mb={4}>
      <Typography variant="h6" color="text.primary" fontWeight="bold" mb={2}>
        Quiz Performance Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} />
          <Tooltip />
          <Bar dataKey="score" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

const StudentQuizzesPage = () => {
  const { studentId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const componentRef = useRef();

  const courseId = state?.courseId || localStorage.getItem('selectedCourseId');
  const courseName = state?.courseName || localStorage.getItem('selectedCourseName');

  const [quizzes, setQuizzes] = useState([]);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Initialize the print handler
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${student?.name}-Quizzes`,
    onAfterPrint: () => console.log('Print successful'),
  });

  useEffect(() => {
    const loadQuizzesAndStudent = async () => {
      try {
        setLoading(true);
        const [quizzesData, studentData] = await Promise.all([
          fetchQuizzesByStudentInCourse(courseId, studentId),
          fetchStudentById(studentId),
        ]);
        setQuizzes(quizzesData || []);
        setStudent(studentData || {});
        setError(false);
      } catch (err) {
        console.error('Error fetching quizzes or student:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzesAndStudent();
  }, [courseId, studentId]);

  const handleQuizClick = (quizId) => {
    navigate(`/course/${courseId}/students/${studentId}/quizzes/${quizId}/results`, {
      state: { student, courseName },
    });
  };

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        backgroundColor: '#ffffff',
        borderRadius: '8px', // Reduced border radius for a flatter design
      }}
    >
      <Box ref={componentRef}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
            <CircularProgress aria-label="loading-indicator" />
          </Box>
        ) : error ? (
          <Alert severity="error" aria-label="error-message">
            Unable to fetch data. Please try again later.
          </Alert>
        ) : (
          <>
            {student && (
              <StudentInfo student={student} courseName={courseName} handlePrint={handlePrint} />
            )}

            <Divider sx={{ marginBottom: '2rem' }} />

            <Typography variant="h6" color="text.primary" fontWeight="bold" mb={3}>
              Quizzes Taken in {courseName} Course
            </Typography>

            {quizzes.length === 0 ? (
              <Typography variant="body1" color="text.secondary">
                No quizzes have been taken by this student in this course.
              </Typography>
            ) : (
              <>
                <QuizzesChart quizzes={quizzes} />
                <QuizzesTable quizzes={quizzes} onQuizClick={handleQuizClick} />
              </>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default StudentQuizzesPage;
