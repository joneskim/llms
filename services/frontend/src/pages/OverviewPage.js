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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';
import {
  fetchModulesByCourseId,
  fetchStudentsByCourseId,
  fetchAssignmentsByModuleId,
  fetchAllQuizResultsForCourse,
  fetchResultsByAssignmentId,
} from '../services/fakeApi';

// Import required icons
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ChartTitle,
  ChartTooltip,
  ChartLegend,
  TimeScale
);

// Styled Components
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StatisticCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  position: 'relative',
  overflow: 'hidden',
  '&:hover $SneakPeek': {
    opacity: 1,
    visibility: 'visible',
  },
}));

const SneakPeek = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.7)',
  color: '#fff',
  padding: theme.spacing(2),
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

const StatisticIcon = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.main,
  fontSize: '2rem',
}));

const ChartContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
}));

const TableContainerStyled = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
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

        // Fetch assignment results
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

  // Combine recent quizzes and assignments
  const recentResults = useMemo(() => {
    const combined = [
      ...quizResults.map((quiz) => ({
        name: quiz.quizName || 'Unnamed Quiz',
        averageScore: quiz.averageScore || 0,
        type: 'Quiz',
        date: quiz.date || new Date().toISOString(),
        id: quiz.id,
      })),
      ...assignmentResults.map((assignment) => ({
        name: assignment.assignmentName || 'Unnamed Assignment',
        averageScore: assignment.averageScore || 0,
        type: 'Assignment',
        date: assignment.date || new Date().toISOString(),
        id: assignment.id,
      })),
    ];

    return combined.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [quizResults, assignmentResults]);

  // Sorted Results
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

  // Prepare line chart data
  const chartData = useMemo(() => {
    const labels = recentResults.map((result) => new Date(result.date));
    const quizScores = recentResults.map((result) =>
      result.type === 'Quiz' ? result.averageScore : null
    );
    const assignmentScores = recentResults.map((result) =>
      result.type === 'Assignment' ? result.averageScore : null
    );

    return {
      labels,
      datasets: [
        {
          label: 'Quiz Scores',
          data: quizScores,
          borderColor: '#42a5f5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          tension: 0.4,
          fill: false,
          spanGaps: true,
        },
        {
          label: 'Assignment Scores',
          data: assignmentScores,
          borderColor: '#66bb6a',
          backgroundColor: 'rgba(102, 187, 106, 0.2)',
          tension: 0.4,
          fill: false,
          spanGaps: true,
        },
      ],
    };
  }, [recentResults]);

  // Chart options
  const chartOptions = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: 'text.primary',
            font: {
              family: 'Roboto, sans-serif',
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
            color: 'text.secondary',
            font: {
              family: 'Roboto, sans-serif',
              size: 12,
            },
            callback: function (value) {
              return value + '%';
            },
          },
          grid: {
            color: 'divider',
          },
        },
        x: {
          type: 'time',
          time: {
            unit: 'day',
            displayFormats: {
              day: 'MMM d',
            },
          },
          ticks: {
            color: 'text.secondary',
            font: {
              family: 'Roboto, sans-serif',
              size: 12,
            },
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    []
  );

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

  // Counts
  const modulesCount = modules.length;
  const quizzesCount = quizResults.length;
  const assignmentsCount = assignments.length;
  const studentsCount = students.length;

  // Loading State
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ backgroundColor: 'background.default' }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  // Error State
  if (error) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="80vh"
        sx={{ backgroundColor: 'background.default' }}
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
    <StyledContainer>
      <Header>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          {`Course "${courseName}" - Overview`}
        </Typography>
      </Header>

      {/* Statistics Section */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard>
            <StatisticIcon>
              <DashboardIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {modulesCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Modules
              </Typography>
            </Box>
            <SneakPeek>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Modules
              </Typography>
              <List dense>
                {modules.slice(0, 5).map((module) => (
                  <ListItem key={module.id} disableGutters>
                    <ListItemText primary={module.module_name} />
                  </ListItem>
                ))}
                {modules.length > 5 && (
                  <Typography variant="body2">and {modules.length - 5} more...</Typography>
                )}
              </List>
            </SneakPeek>
          </StatisticCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard>
            <StatisticIcon>
              <QuizIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {quizzesCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Quizzes
              </Typography>
            </Box>
            <SneakPeek>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Recent Quizzes
              </Typography>
              <List dense>
                {quizResults.slice(0, 5).map((quiz) => (
                  <ListItem key={quiz.id} disableGutters>
                    <ListItemText primary={quiz.quizName} />
                  </ListItem>
                ))}
                {quizzesCount > 5 && (
                  <Typography variant="body2">and {quizzesCount - 5} more...</Typography>
                )}
              </List>
            </SneakPeek>
          </StatisticCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard>
            <StatisticIcon>
              <AssignmentIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {assignmentsCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Assignments
              </Typography>
            </Box>
            <SneakPeek>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Recent Assignments
              </Typography>
              <List dense>
                {assignments.slice(0, 5).map((assignment) => (
                  <ListItem key={assignment.id} disableGutters>
                    <ListItemText primary={assignment.assignment_name} />
                  </ListItem>
                ))}
                {assignmentsCount > 5 && (
                  <Typography variant="body2">and {assignmentsCount - 5} more...</Typography>
                )}
              </List>
            </SneakPeek>
          </StatisticCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatisticCard>
            <StatisticIcon>
              <PeopleIcon fontSize="large" />
            </StatisticIcon>
            <Box>
              <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                {studentsCount}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Students Enrolled
              </Typography>
            </Box>
            <SneakPeek>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginBottom: 1 }}>
                Students
              </Typography>
              <List dense>
                {students.slice(0, 5).map((student) => (
                  <ListItem key={student.id} disableGutters>
                    <ListItemText primary={student.name} />
                  </ListItem>
                ))}
                {studentsCount > 5 && (
                  <Typography variant="body2">and {studentsCount - 5} more...</Typography>
                )}
              </List>
            </SneakPeek>
          </StatisticCard>
        </Grid>
      </Grid>

      {/* Chart Section */}
      <ChartContainer>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
          Recent Quiz and Assignment Results Over Time
        </Typography>
        {recentResults.length > 0 ? (
          <Line data={chartData} options={chartOptions} />
        ) : (
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No recent results available.
          </Typography>
        )}
      </ChartContainer>

      {/* Recent Results Table */}
      <Box marginTop={4}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
          Recent Quizzes and Assignments
        </Typography>
        <TableContainerStyled component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
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
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
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
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
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
                paginatedResults.map((result) => (
                  <TableRow
                    key={result.id}
                    onClick={() => handleNavigate(result.type, result.id)}
                    sx={{ cursor: 'pointer' }}
                    hover
                  >
                    <TableCell>{result.type}</TableCell>
                    <TableCell>{result.name}</TableCell>
                    <TableCell>{result.averageScore}%</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No recent results available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainerStyled>

        {/* Pagination Controls */}
        {sortedResults.length > rowsPerPage && (
          <Box display="flex" justifyContent="center" marginTop={2}>
            <Pagination
              count={Math.ceil(sortedResults.length / rowsPerPage)}
              page={currentPage}
              onChange={(e, page) => setCurrentPage(page)}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
        )}
      </Box>
    </StyledContainer>
  );
};

export default OverviewPage;
