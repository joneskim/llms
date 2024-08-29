import React, { useState, useEffect } from 'react';
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
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchStudentsByCourseId,
  fetchQuizzesByModuleId,
  fetchAssignmentsByModuleId,
} from '../services/fakeApi';

// Register the components with Chart.js
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OverviewPage = () => {
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
        const teacherId = 1; // Replace with the actual logic to get the teacher ID
        const courses = await fetchCoursesByTeacherId(teacherId);
        const currentCourse = courses.find((course) => course.id === 1); // Example: using a specific course ID
        if (currentCourse) {
          setCourse(currentCourse);

          // Fetch modules
          const loadedModules = await fetchModulesByCourseId(currentCourse.id);
          setModules(loadedModules);

          // Fetch students
          const loadedStudents = await fetchStudentsByCourseId(currentCourse.id);
          setStudents(loadedStudents);

          // Fetch quizzes and assignments for each module
          const allQuizzes = [];
          const allAssignments = [];
          for (const module of loadedModules) {
            const moduleQuizzes = await fetchQuizzesByModuleId(module.id);
            allQuizzes.push(...moduleQuizzes);

            const moduleAssignments = await fetchAssignmentsByModuleId(currentCourse.id, module.id);
            allAssignments.push(...moduleAssignments);
          }
          setQuizzes(allQuizzes);
          setAssignments(allAssignments);
        } else {
          setError('Course not found.');
        }
      } catch (err) {
        console.error('Error loading course data:', err);
        setError('Failed to load course data.');
      } finally {
        setLoading(false);
      }
    };

    loadCourseData();
  }, []);

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

  // Simulate recent results for quizzes and assignments
  const recentResults = [
    ...quizzes.slice(-5).map((quiz) => ({
      name: quiz.quiz_name,
      averageScore: Math.floor(Math.random() * 100), // Replace with actual score data
      type: 'Quiz',
    })),
    ...assignments.slice(-5).map((assignment) => ({
      name: assignment.assignment_name,
      averageScore: Math.floor(Math.random() * 100), // Replace with actual score data
      type: 'Assignment',
    })),
  ];

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
