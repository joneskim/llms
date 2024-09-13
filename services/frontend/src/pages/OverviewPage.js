import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
} from '@mui/material';
import { Bar } from 'react-chartjs-2';
import {
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Chart } from 'chart.js';
import {
  fetchModulesByCourseId,
  fetchStudentsByCourseId,
  fetchAssignmentsByModuleId,
  fetchAllQuizResultsForCourse,  // Import the new function
} from '../services/fakeApi';

// Register the components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewPage = () => {
  const location = useLocation();
  const courseId = location.state?.courseId || localStorage.getItem('selectedCourseId');
  const courseName = location.state?.courseName || localStorage.getItem('selectedCourseName');

  

  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Fetch modules and students concurrently using the course name
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
        setAssignments(allAssignments.flat());

        // Fetch all quiz results for the course
        console.log('Fetching quiz results for course:', courseName);
        const loadedQuizResults = await fetchAllQuizResultsForCourse(courseId);
        setQuizResults(loadedQuizResults);

      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseName]);

  const recentResults = quizResults.slice(-5).map((quiz) => ({
    name: quiz.quizName,  // Use the correct property name
    averageScore: quiz.averageScore,  // Display the average score for each quiz
    type: 'Quiz',
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  // Prepare data for charts and statistics
  const modulesCount = modules.length;
  const quizzesCount = quizResults.length;
  const assignmentsCount = assignments.length;
  const studentsCount = students.length;

  // Chart Data for Recent Results
  const chartData = {
    labels: recentResults.map((result) => result.name),
    datasets: [
      {
        label: 'Average Scores',
        data: recentResults.map((result) => result.averageScore),
        backgroundColor: recentResults.map((result) =>
          result.type === 'Quiz' ? '#3e95cd' : '#ffa726'
        ),
      },
    ],
  };

  return (
    <Box padding={3}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2a2a3b', marginBottom: '1.5rem' }}>
        {`Course ${courseName} - Overview`}
      </Typography>

      {/* Statistics Table */}
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Modules
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Quizzes
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Assignments
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Students Enrolled
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e95cd' }}>
                {modulesCount}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e95cd' }}>
                {quizzesCount}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e95cd' }}>
                {assignmentsCount}
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#3e95cd' }}>
                {studentsCount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Recent Quiz and Assignment Results Chart */}
      <Paper
        elevation={3}
        sx={{
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem',
          backgroundColor: '#f7f9fc',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2a2a3b', marginBottom: '1rem' }}>
          Recent Quiz Results
        </Typography>
        <Bar data={chartData} />
      </Paper>

      {/* List of Recent Quizzes and Assignments */}
      <TableContainer component={Paper} sx={{ marginTop: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Type
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Name
              </TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold', fontSize: '1.1rem', padding: '16px' }}>
                Average Score
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell>{result.type}</TableCell>
                <TableCell>{result.name}</TableCell>
                <TableCell>{result.averageScore}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OverviewPage;
