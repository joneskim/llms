// StudentQuizzesPage.jsx

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Tooltip,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import DoneIcon from '@mui/icons-material/Done';
import { useReactToPrint } from 'react-to-print';
import { fetchQuizzesByStudentInCourse, fetchStudentById } from '../services/fakeApi';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { styled } from '@mui/material/styles';

// Styled Components

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
}));

const StudentInfoBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
}));

const StudentDetails = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

const AvatarStyled = styled(Avatar)(({ theme }) => ({
  width: 80,
  height: 80,
  marginRight: theme.spacing(3),
  backgroundColor: theme.palette.primary.main,
  fontSize: '2rem',
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: theme.spacing(2),
  cursor: 'pointer',
  backgroundColor: '#f5f5f5',
  userSelect: 'none',
}));

const TableDataCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(2),
  color: theme.palette.text.primary,
}));

const TableRowStyled = styled(TableRow)(({ theme }) => ({
  cursor: 'pointer',
  transition: 'background-color 0.3s ease-in-out',
  '&:hover': {
    backgroundColor: '#fafafa',
  },
}));

const QuizzesChartBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const SidePanelPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  boxShadow: 'none',
  backgroundColor: '#f9f9f9',
}));

// Sub-component to display student information
const StudentInfo = ({ student, courseName, handlePrint }) => (
  <StudentInfoBox>
    <StudentDetails>
      <AvatarStyled aria-label="student-avatar">
        {student.name.charAt(0).toUpperCase()}
      </AvatarStyled>
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
    </StudentDetails>
    <Tooltip title="Print Quizzes">
      <IconButton onClick={handlePrint} aria-label="print-quizzes" color="primary">
        <PrintIcon />
      </IconButton>
    </Tooltip>
  </StudentInfoBox>
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
        const aValue = a[sortConfig.key].toLowerCase();
        const bValue = b[sortConfig.key].toLowerCase();

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
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
          marginBottom: '1rem',
          boxShadow: 'none',
          backgroundColor: 'transparent',
        }}
      >
        <Table aria-label="quizzes-table">
          <TableHead>
            <TableRow>
              <TableHeaderCell onClick={() => handleSort('quizName')}>
                Quiz Name {sortConfig.key === 'quizName' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </TableHeaderCell>
              <TableHeaderCell align="right" onClick={() => handleSort('score')}>
                Percentage Score {sortConfig.key === 'score' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}
              </TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentQuizzes.map((quiz) => (
              <TableRowStyled
                key={quiz.quizId}
                onClick={() => onQuizClick(quiz.quizId)}
                tabIndex={0}
                role="button"
                aria-label={`View results for ${quiz.quizName}`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') onQuizClick(quiz.quizId);
                }}
              >
                <TableDataCell>{quiz.quizName}</TableDataCell>
                <TableDataCell
                  align="right"
                  sx={{
                    color: quiz.score >= 50 ? '#27ae60' : '#e74c3c',
                  }}
                >
                  {quiz.score !== null ? `${quiz.score}%` : 'N/A'}
                </TableDataCell>
              </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handleChangePage}
            color="primary"
            showFirstButton
            showLastButton
            aria-label="quiz-pagination"
          />
        </Box>
      )}
    </Box>
  );
};

// Sub-component to display quiz scores in a bar chart
const QuizzesChart = ({ quizzes }) => {
  const chartData = useMemo(
    () =>
      quizzes.map((quiz) => ({
        name: quiz.quizName,
        score: quiz.score,
      })),
    [quizzes]
  );

  return (
    <QuizzesChartBox>
      <Typography variant="h6" color="text.primary" fontWeight="bold" mb={2}>
        Quiz Performance Overview
      </Typography>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis domain={[0, 100]} />
          <RechartsTooltip />
          <Bar dataKey="score" fill="#3498db" />
        </BarChart>
      </ResponsiveContainer>
    </QuizzesChartBox>
  );
};

// Sub-component for Side Panel


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

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Prepare chart data
  const chartData = useMemo(
    () =>
      quizzes.map((quiz) => ({
        name: quiz.quizName,
        score: quiz.score,
      })),
    [quizzes]
  );

  if (loading) {
    return (
      <StyledContainer maxWidth="lg">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} aria-label="loading-indicator" />
        </Box>
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer maxWidth="lg">
        <Alert severity="error" aria-label="error-message">
          Unable to fetch data. Please try again later.
        </Alert>
      </StyledContainer>
    );
  }

  return (
    <StyledContainer maxWidth="lg">
      <Box ref={componentRef}>
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
          <Grid container spacing={4}>
            {/* Main Content Area */}
            <Grid item xs={12} md={12}>
              <QuizzesChart quizzes={quizzes} />
              <QuizzesTable quizzes={quizzes} onQuizClick={handleQuizClick} />
            </Grid>
            
          </Grid>
        )}
      </Box>
    </StyledContainer>
  );
};

export default StudentQuizzesPage;
