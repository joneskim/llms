// src/pages/OverviewPage.js

import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  Pagination,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
} from 'chart.js';
import {
  fetchModulesByCourseId,
  fetchStudentsByCourseId,
  fetchAssignmentsByModuleId,
  fetchAllQuizResultsForCourse,
  fetchResultsByAssignmentId,
} from '../services/fakeApi';

// Import the required icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Register the components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, ChartTooltip, ChartLegend);

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  backgroundColor: '#FFFFFF', // Pure White
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
}));

const StatisticBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  backgroundColor: '#F3F4F6', // Light gray for subtle differentiation
  color: '#212529', // Dark Gray
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
}));

const StatisticIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  fontSize: '2rem',
  color: theme.palette.primary.main, // Use theme's primary color
}));

const OverviewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId || localStorage.getItem('selectedCourseId');
  const courseName = location.state?.courseName || localStorage.getItem('selectedCourseName');

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [assignmentResults, setAssignmentResults] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Sorting Configuration
  const [sortConfig, setSortConfig] = useState({ key: 'date', direction: 'descending' });

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Fetch modules and students concurrently
        const [loadedModules, loadedStudents] = await Promise.all([
          fetchModulesByCourseId(courseId),
          fetchStudentsByCourseId(courseId),
        ]);
        setModules(loadedModules);
        setStudents(loadedStudents);

        // Fetch assignments for each module
        const allAssignments = await Promise.all(
          loadedModules.map((module) => fetchAssignmentsByModuleId(courseId, module.id))
        );
        const flattenedAssignments = allAssignments.flat();
        setAssignments(flattenedAssignments);

        // Fetch assignment results concurrently
        const assignmentResultPromises = flattenedAssignments.map((assignment) =>
          fetchResultsByAssignmentId(courseId, assignment.id)
        );
        const loadedAssignmentResults = await Promise.all(assignmentResultPromises);
        setAssignmentResults(loadedAssignmentResults.flat());

        // Fetch all quiz results for the course
        const loadedQuizResults = await fetchAllQuizResultsForCourse(courseId);
        setQuizResults(loadedQuizResults);
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  // Combine recent quizzes and assignments using useMemo (always called)
  const recentResults = useMemo(() => {
    const combined = [
      ...quizResults.map((quiz) => ({
        name: quiz.quizName || 'Unnamed Quiz',
        averageScore: quiz.averageScore || 0,
        type: 'Quiz',
        date: quiz.date || new Date().toISOString(),
        id: quiz.id, // Ensure each quiz has an id
      })),
      ...assignmentResults.map((assignment) => ({
        name: assignment.assignmentName || 'Unnamed Assignment',
        averageScore: assignment.averageScore || 0,
        type: 'Assignment',
        date: assignment.date || new Date().toISOString(),
        id: assignment.id, // Ensure each assignment has an id
      })),
    ];

    return combined
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [quizResults, assignmentResults]);

  // Sorted Results for Sorting Functionality
  const sortedResults = useMemo(() => {
    const sortableResults = [...recentResults];
    if (sortConfig !== null) {
      sortableResults.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableResults;
  }, [recentResults, sortConfig]);

  // Pagination Logic
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedResults.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedResults, currentPage]);

  // Prepare chart data
  const chartData = useMemo(() => ({
    labels: recentResults.map((result) => result.name),
    datasets: [
      {
        label: 'Average Scores (%)',
        data: recentResults.map((result) => result.averageScore),
        backgroundColor: recentResults.map((result) =>
          result.type === 'Quiz' ? '#3498DB' : '#E67E22' // Sky Blue for Quizzes, Sunset Orange for Assignments
        ),
      },
    ],
  }), [recentResults]);

  // Prepare data for charts and statistics
const modulesCount = modules.length;
const quizzesCount = quizResults.length;
const assignmentsCount = assignments.length;
const studentsCount = students.length;


  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#212529', // Dark Gray
          font: {
            family: 'Poppins, sans-serif',
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Average Score: ${context.parsed.y}%`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#212529', // Dark Gray
          font: {
            family: 'Poppins, sans-serif',
            size: 12,
          },
        },
        grid: {
          color: '#DEE2E6', // Very Light Gray
        },
      },
      x: {
        ticks: {
          color: '#212529', // Dark Gray
          font: {
            family: 'Poppins, sans-serif',
            size: 12,
          },
        },
        grid: {
          display: false,
        },
      },
    },
  }), [recentResults]);

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Handle Navigation
  const handleNavigate = (type, id) => {
    if (type === 'Quiz') {
      navigate(`/course/${courseId}/quizzes/${id}`);
    } else if (type === 'Assignment') {
      navigate(`/course/${courseId}/assignments/${id}`);
    }
  };

  // Render Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ backgroundColor: '#FFFFFF' }} // Pure White
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Render Error State
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ backgroundColor: '#FFFFFF' }} // Pure White
      >
        <Alert severity="error" sx={{ marginBottom: '1rem' }}>
          {error}
        </Alert>
        <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box padding={3} sx={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 'bold',
          color: '#212529', // Dark Gray
          marginBottom: '2rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        {`Course "${courseName}" - Overview`}
      </Typography>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ marginBottom: '2rem' }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticBox>
            <StatisticIcon>
              <DashboardIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: '#3498DB', fontFamily: 'Poppins, sans-serif' }}>
                {modulesCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                Modules
              </Typography>
            </Box>
          </StatisticBox>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticBox>
            <StatisticIcon>
              <QuizIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: '#3498DB', fontFamily: 'Poppins, sans-serif' }}>
                {quizzesCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                Quizzes
              </Typography>
            </Box>
          </StatisticBox>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticBox>
            <StatisticIcon>
              <AssignmentIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: '#3498DB', fontFamily: 'Poppins, sans-serif' }}>
                {assignmentsCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                Assignments
              </Typography>
            </Box>
          </StatisticBox>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatisticBox>
            <StatisticIcon>
              <PeopleIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: '#3498DB', fontFamily: 'Poppins, sans-serif' }}>
                {studentsCount}
              </Typography>
              <Typography variant="subtitle1" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                Students Enrolled
              </Typography>
            </Box>
          </StatisticBox>
        </Grid>
      </Grid>

      {/* Recent Quiz and Assignment Results Chart */}
      <StyledPaper>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#212529', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}
        >
          Recent Quiz and Assignment Results
        </Typography>
        {recentResults.length > 0 ? (
          <Bar data={chartData} options={chartOptions} />
        ) : (
          <Typography variant="body1" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
            No recent results available.
          </Typography>
        )}
      </StyledPaper>

      {/* Recent Quizzes and Assignments Table */}
      <Box marginTop={4}>
        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#212529', marginBottom: '1rem', fontFamily: 'Poppins, sans-serif' }}
        >
          Recent Quizzes and Assignments
        </Typography>
        <TableContainer component={Paper} sx={{ backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ color: '#212529', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
                  onClick={() => handleSort('type')}
                >
                  Type
                  {sortConfig.key === 'type' ? (
                    sortConfig.direction === 'ascending' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  ) : null}
                </TableCell>
                <TableCell
                  sx={{ color: '#212529', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
                  onClick={() => handleSort('name')}
                >
                  Name
                  {sortConfig.key === 'name' ? (
                    sortConfig.direction === 'ascending' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  ) : null}
                </TableCell>
                <TableCell
                  sx={{ color: '#212529', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif', cursor: 'pointer' }}
                  onClick={() => handleSort('averageScore')}
                >
                  Average Score (%)
                  {sortConfig.key === 'averageScore' ? (
                    sortConfig.direction === 'ascending' ? (
                      <ArrowUpwardIcon fontSize="small" />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" />
                    )
                  ) : null}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedResults.length > 0 ? (
                paginatedResults.map((result, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleNavigate(result.type, result.id)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${result.type}: ${result.name}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleNavigate(result.type, result.id);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                      {result.type}
                    </TableCell>
                    <TableCell sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                      {result.name}
                    </TableCell>
                    <TableCell sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                      {result.averageScore}%
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: '#212529', fontFamily: 'Poppins, sans-serif' }}>
                    No recent results available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination Controls */}
        {recentResults.length > rowsPerPage && (
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(recentResults.length / rowsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
            />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default OverviewPage;
