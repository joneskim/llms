import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Pagination,
  List, ListItem, ListItemText,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import { fetchModulesByCourseId, fetchQuizzesByModuleId, fetchAssignmentsByModuleId } from '../services/fakeApi';

const ModulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(location.state?.module || {});
  const usedModuleId = moduleId || module.id;
  const usedCourseId = courseId || module.course_id;

  const [quizzes, setQuizzes] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [quizzesPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadModuleData = async () => {
      if (!module.id) {
        const modules = await fetchModulesByCourseId(usedCourseId);
        const foundModule = modules.find((mod) => mod.id === Number(usedModuleId));
        setModule(foundModule);
      }
    };

    loadModuleData();
  }, [usedCourseId, usedModuleId, module]);

  useEffect(() => {
    if (module.id) {
      const loadData = async () => {
        const quizzesData = await fetchQuizzesByModuleId(module.id);
        setQuizzes(quizzesData);

        const assignments = await fetchAssignmentsByModuleId(module.id);
        setPerformance(calculatePerformance(assignments, quizzesData));
      };

      loadData();
    }
  }, [module]);

  const calculatePerformance = (assignments, quizzes) => {
    const totalScores = [...assignments, ...quizzes].map((item) => item.score || 0);
    const overallAverage = totalScores.length ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;
    const highestScore = Math.max(...totalScores);
    const lowestScore = Math.min(...totalScores);

    return {
      overallAverage,
      highestScore,
      lowestScore,
    };
  };

  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = quizzes
    .filter((quiz) => quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstQuiz, indexOfLastQuiz);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditQuiz = (quiz) => {
    navigate(`/course/${usedCourseId}/modules/${usedModuleId}/edit-quiz/${quiz.id}`, {
      state: { quiz, module },
    });
  };

  const handleCreateQuiz = () => {
    navigate(`/course/${usedCourseId}/modules/${usedModuleId}/create-quiz`, {
      state: { module, courseId: usedCourseId },
    });
  };

  const handleTakeQuiz = (quiz) => {
    navigate(`/course/${usedCourseId}/modules/${usedModuleId}/take-quiz/${quiz.id}`, {
      state: { quiz },
    });
  };

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={3}>
        Quizzes for {module.module_name}
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
                align="right"
                sx={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderBottom: 'none',
                  padding: '16px',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentQuizzes.map((quiz) => (
              <TableRow key={quiz.id}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ cursor: 'pointer', color: '#2a2a3b' }}
                  onClick={() => handleTakeQuiz(quiz)}
                >
                  {quiz.quiz_name}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Quiz" placement="top">
                    <IconButton onClick={() => handleEditQuiz(quiz)} sx={{ color: '#1abc9c' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
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

      <Button
        variant="contained"
        startIcon={<QuizIcon />}
        onClick={handleCreateQuiz}
        sx={{
          backgroundColor: '#2a2a3b',
          color: 'white',
          marginTop: '2rem',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
        }}
        fullWidth
        size="large"
      >
        Create Quiz for this Module
      </Button>

      <Typography variant="h5" color="#2a2a3b" fontWeight="bold" mt={5} mb={2}>
        Performance Overview
      </Typography>

      <Paper elevation={0} sx={{ padding: '1rem', backgroundColor: '#fff' }}>
        <List>
          {performance ? (
            <>
              <ListItem>
                <ListItemText primary={`Overall Average: ${performance.overallAverage.toFixed(2)}%`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Highest Score: ${performance.highestScore}%`} />
              </ListItem>
              <ListItem>
                <ListItemText primary={`Lowest Score: ${performance.lowestScore}%`} />
              </ListItem>
            </>
          ) : (
            <Typography variant="body1" color="#2a2a3b">
              No performance data available.
            </Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default ModulePage;
