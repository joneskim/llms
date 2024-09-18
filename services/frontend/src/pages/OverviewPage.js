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
import { Bar } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
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
  BarElement, // Register BarElement for Bar Charts
  ChartTitle,
  ChartTooltip,
  ChartLegend
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

const ChartContainer = styled(Paper)(({ theme, eventCount }) => ({
  padding: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[1],
  height: '600px', // Increased height for better visibility
  width: `${Math.max(1500, eventCount * 100)}px`, // Dynamic width based on the number of events
  overflowX: 'auto', // Enable horizontal scrolling
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

  // Fetch data on component mount
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

  // Combine quizzes and assignments into a single sorted array
  const combinedResults = useMemo(() => {
    const quizzes = quizResults.map((quiz) => ({
      id: quiz.id,
      name: quiz.quizName || `Quiz ${quiz.id}`,
      averageScore: quiz.averageScore || 0,
      type: 'Quiz',
      date: new Date(quiz.date),
    }));

    const assignmentsData = assignmentResults.map((assignment) => ({
      id: assignment.id,
      name: assignment.assignmentName || `Assignment ${assignment.id}`,
      averageScore: assignment.averageScore || 0,
      type: 'Assignment',
      date: new Date(assignment.date),
    }));

    // Merge and sort by date
    return [...quizzes, ...assignmentsData].sort((a, b) => a.date - b.date);
  }, [quizResults, assignmentResults]);

  // Generate unique labels for each event
  const labels = useMemo(() => {
    return combinedResults.map((result, index) => {
      // Format date as Month Day, e.g., Jan 15
      const formattedDate = result.date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return `${formattedDate} - ${result.type} ${index + 1}`;
    });
  }, [combinedResults]);

  // Prepare the dataset with differentiated colors
  const data = useMemo(() => {
    return {
      labels,
      datasets: [
        {
          label: 'Quiz Scores',
          data: combinedResults.map((result) => (result.type === 'Quiz' ? result.averageScore : 0)),
          backgroundColor: '#42a5f5', // Blue for Quizzes
        },
        {
          label: 'Assignment Scores',
          data: combinedResults.map((result) => (result.type === 'Assignment' ? result.averageScore : 0)),
          backgroundColor: '#66bb6a', // Green for Assignments
        },
      ],
    };
  }, [labels, combinedResults]);

  // Chart options
  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false, // Allow the chart to adjust its height
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
              if (context.dataset.label === 'Quiz Scores') {
                return `Quiz Score: ${context.parsed.y}%`;
              } else if (context.dataset.label === 'Assignment Scores') {
                return `Assignment Score: ${context.parsed.y}%`;
              }
              return `${context.dataset.label}: ${context.parsed.y}%`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100, // Assuming scores are out of 100
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
          ticks: {
            color: 'text.secondary',
            font: {
              family: 'Roboto, sans-serif',
              size: 12,
            },
            maxRotation: 90,
            minRotation: 45,
            autoSkip: false, // Ensure all labels are displayed
          },
          grid: {
            display: false,
          },
        },
      },
    }),
    []
  );

  // Sorted Results
  const sortedResults = useMemo(() => {
    const sortableResults = [...combinedResults];
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
  }, [combinedResults, sortConfig]);

  // Pagination Logic
  const paginatedResults = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return sortedResults.slice(startIndex, startIndex + rowsPerPage);
  }, [sortedResults, currentPage]);

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
      <Box sx={{ overflowX: 'auto' }}>
        <ChartContainer eventCount={combinedResults.length}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary', marginBottom: 2 }}>
            Recent Quiz and Assignment Results Over Time
          </Typography>
          {combinedResults.length > 0 ? (
            <Bar data={data} options={options} />
          ) : (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              No recent results available.
            </Typography>
          )}
        </ChartContainer>
      </Box>

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
