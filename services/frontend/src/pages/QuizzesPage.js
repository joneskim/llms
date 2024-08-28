import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Pagination,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { fetchModulesByCourseId, fetchQuizzesByModuleId } from '../services/fakeApi'; // Ensure these functions are correctly imported

const QuizzesPage = () => {
  const { courseId } = useParams(); // Get courseId from the route
  const [modules, setModules] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5); // Set quizzes per page

  useEffect(() => {
    const loadModulesAndQuizzes = async () => {
      try {
        console.log('Course ID:', courseId);
        const loadedModules = await fetchModulesByCourseId(Number(courseId)); // Fetch modules
        const allQuizzes = [];

        console.log(loadedModules);

        for (const module of loadedModules) {
          const quizzesForModule = await fetchQuizzesByModuleId(module.id); // Fetch quizzes for each module
          allQuizzes.push(...quizzesForModule.map((quiz) => ({ ...quiz, moduleName: module.module_name })));
        }

        setModules(loadedModules);
        setQuizzes(allQuizzes);
      } catch (err) {
        setError('Failed to load quizzes.');
      } finally {
        setLoading(false);
      }
    };

    loadModulesAndQuizzes();
  }, [courseId]);

  // Pagination logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes
    .filter((quiz) => quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstQuiz, indexOfLastQuiz);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

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

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={3}>
        Quizzes
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search quizzes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white', borderRadius: '4px' }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#2a2a3b', borderRadius: '8px' }}>
              <TableCell
                sx={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderBottom: 'none',
                  padding: '16px',
                }}
              >
                Quiz Title
              </TableCell>
              <TableCell
                sx={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderBottom: 'none',
                  padding: '16px',
                }}
              >
                Module Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentQuizzes.length > 0 ? (
              currentQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell sx={{ color: '#2a2a3b' }}>{quiz.quiz_name}</TableCell>
                  <TableCell sx={{ color: '#2a2a3b' }}>{quiz.moduleName}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No quizzes available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(quizzes.length / quizzesPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      />
    </Container>
  );
};

export default QuizzesPage;
