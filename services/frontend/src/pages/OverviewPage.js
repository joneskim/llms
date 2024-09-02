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
  fetchQuizzesByModuleId,
  fetchAssignmentsByModuleId,
  fetchResultsByQuizId,
  fetchResultsByAssignmentId,
} from '../services/fakeApi';

// Register the components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewPage = () => {
  const location = useLocation();
  const { courseId } = location.state || {};

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [students, setStudents] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourseData = async () => {
      try {
        // Fetch modules, students, quizzes, and assignments concurrently using the courseId
        const [loadedModules, loadedStudents] = await Promise.all([
          fetchModulesByCourseId(courseId),
          fetchStudentsByCourseId(courseId),
        ]);
        setModules(loadedModules);
        setStudents(loadedStudents);

        // Fetch quizzes and assignments for each module
        const [allQuizzes, allAssignments] = await Promise.all([
          Promise.all(loadedModules.map((module) => fetchQuizzesByModuleId(module.id))),
          Promise.all(loadedModules.map((module) => fetchAssignmentsByModuleId(courseId, module.id))),
        ]);

        setQuizzes(allQuizzes.flat());
        setAssignments(allAssignments.flat());
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, [courseId]);

  const calculateAverageScore = async (results) => {
    if (results.length === 0) return 0;
    const totalScore = results.reduce((sum, result) => sum + result.score, 0);
    return Math.round(totalScore / results.length);
  };

  const getRecentResults = async () => {
    const recentQuizResults = await Promise.all(
      quizzes.slice(-5).map(async (quiz) => {
        const results = await fetchResultsByQuizId(quiz.id);
        const averageScore = await calculateAverageScore(results);
        return {
          name: quiz.quiz_name,
          averageScore,
          type: 'Quiz',
        };
      })
    );

    const recentAssignmentResults = await Promise.all(
      assignments.slice(-5).map(async (assignment) => {
        const results = await fetchResultsByAssignmentId(assignment.id);
        const averageScore = await calculateAverageScore(results);
        return {
          name: assignment.assignment_name,
          averageScore,
          type: 'Assignment',
        };
      })
    );

    return [...recentQuizResults, ...recentAssignmentResults];
  };

  const [recentResults, setRecentResults] = useState([]);

  useEffect(() => {
    const fetchRecentResults = async () => {
      const results = await getRecentResults();
      setRecentResults(results);
    };

    if (!loading && !error) {
      fetchRecentResults();
    }
  }, [loading, error]);

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
  const quizzesCount = quizzes.length;
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
        {course?.course_name} - Overview
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
          Recent Quiz and Assignment Results
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
