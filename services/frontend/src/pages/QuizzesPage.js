// src/pages/QuizzesPage.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import QuizIcon from '@mui/icons-material/Quiz';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  StyledContainer,
  Header,
  Title,
  SearchField,
  BackButton,
  ErrorBox,
} from './design/StyledComponents';
import { fetchModulesByCourseId, fetchQuizzesByModuleId } from '../services/fakeApi';

const StyledTableHead = styled(TableHead)({
  backgroundColor: '#E5E7EB', // Light gray for header
});

const StyledTableCell = styled(TableCell)({
  color: '#374151', // Darker gray for text
  fontWeight: '600',
});

const StyledTableRow = styled(TableRow)({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: '#F3F4F6', // Slight hover effect
  },
});

const QuizzesPage = () => {
  const theme = useTheme();
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 5;

  // Add Quiz Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');
  const [addQuizError, setAddQuizError] = useState('');

  useEffect(() => {
    const loadQuizzesAndModules = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch modules by course ID
        const fetchedModules = await fetchModulesByCourseId(courseId);
        setModules(fetchedModules);

        if (!fetchedModules.length) {
          setQuizzes([]);
          setError('No modules found for this course.');
          return;
        }

        // Fetch quizzes for each module and combine them
        const quizzesPromises = fetchedModules.map(async (module) => {
          const moduleQuizzes = await fetchQuizzesByModuleId(module.id);
          return moduleQuizzes.map((quiz) => ({
            ...quiz,
            moduleName: module.module_name,
            moduleId: module.id,
            date: quiz.date || new Date().toISOString(),
            name: quiz.quiz_name || 'Unnamed Quiz',
          }));
        });

        const quizzesArrays = await Promise.all(quizzesPromises);
        const allQuizzes = quizzesArrays.flat();

        // Sort quizzes by date descending
        const sortedQuizzes = allQuizzes.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setQuizzes(sortedQuizzes);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to load quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadQuizzesAndModules();
  }, [courseId]);

  // Filtering quizzes based on search term
  const filteredQuizzes = useMemo(() => {
    return quizzes.filter((quiz) =>
      quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [quizzes, searchTerm]);

  // Pagination Logic
  const indexOfLastQuiz = currentPage * quizzesPerPage;
  const indexOfFirstQuiz = indexOfLastQuiz - quizzesPerPage;
  const currentQuizzes = filteredQuizzes.slice(indexOfFirstQuiz, indexOfLastQuiz);
  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditQuiz = (event, quiz) => {
    event.stopPropagation();
    navigate(`/course/${courseId}/modules/${quiz.moduleId}/edit-quiz/${quiz.id}`, {
      state: { quiz },
    });
  };

  const handleTakeQuiz = (quiz) => {
    navigate(`/course/${courseId}/modules/${quiz.moduleId}/take-quiz/${quiz.id}`, {
      state: { quiz },
    });
  };

  const handleCreateQuiz = () => {
    setOpenAddModal(true);
    setSelectedModuleId('');
    setAddQuizError('');
  };

  const handleAddQuizClose = () => {
    setOpenAddModal(false);
    setSelectedModuleId('');
    setAddQuizError('');
  };

  const handleAddQuizSubmit = async () => {
    if (!selectedModuleId) {
      setAddQuizError('Please select a module.');
      return;
    }

    try {
      // Navigate to CreateQuizPage with the selected module ID
      navigate(`/course/${courseId}/modules/${selectedModuleId}/create-quiz`, {
        state: { moduleId: selectedModuleId },
      });
      setOpenAddModal(false);
      setSelectedModuleId('');
      setAddQuizError('');
    } catch (err) {
      console.error('Error navigating to CreateQuizPage:', err);
      setAddQuizError('Failed to navigate. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <ErrorBox>
        <CircularProgress color="primary" />
      </ErrorBox>
    );
  }

  if (error) {
    return (
      <ErrorBox>
        <Alert
          severity="error"
          action={
            <IconButton aria-label="refresh" color="inherit" size="small" onClick={() => window.location.reload()}>
              <RefreshIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </ErrorBox>
    );
  }

  return (
    <StyledContainer>
      {/* Header Section */}
      <Header>
        <BackButton onClick={handleBack} aria-label="Go back">
          <ArrowBackIosNewIcon />
        </BackButton>
        <Title variant="h5">Quizzes</Title>
      </Header>

      {/* Search Bar */}
      <SearchField
        variant="outlined"
        placeholder="Search quizzes..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset to first page on search term change
        }}
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }}
        aria-label="Search quizzes"
      />

      {/* Quizzes Table */}
      {currentQuizzes.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No quizzes match your search criteria.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Quiz Name</StyledTableCell>
                <StyledTableCell>Module</StyledTableCell>
                <StyledTableCell>Date</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {currentQuizzes.map((quiz) => (
                <StyledTableRow key={quiz.id}>
                  <TableCell>{quiz.name}</TableCell>
                  <TableCell>{quiz.moduleName}</TableCell>
                  <TableCell>{new Date(quiz.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit quiz"
                      onClick={(e) => handleEditQuiz(e, quiz)}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                    <IconButton
                      aria-label="take quiz"
                      onClick={() => handleTakeQuiz(quiz)}
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      <QuizIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Quiz Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          startIcon={<QuizIcon />}
          onClick={handleCreateQuiz}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          fullWidth
          aria-label="Create new quiz"
        >
          Create New Quiz
        </Button>
      </Box>

      {/* Pagination Controls */}
      {filteredQuizzes.length > quizzesPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredQuizzes.length / quizzesPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Module Selection Dialog */}
      <Dialog open={openAddModal} onClose={handleAddQuizClose} fullWidth maxWidth="sm">
        <DialogTitle>Select Module</DialogTitle>
        <DialogContent>
          {addQuizError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addQuizError}
            </Alert>
          )}
          <FormControl fullWidth margin="dense" variant="outlined" required>
            <InputLabel>Module</InputLabel>
            <Select
              value={selectedModuleId}
              onChange={(e) => setSelectedModuleId(e.target.value)}
              label="Module"
              aria-label="Select Module"
              sx={{
                backgroundColor: '#fafafa',
                borderRadius: '8px',
              }}
            >
              {modules.map((module) => (
                <MenuItem key={module.id} value={module.id}>
                  {module.module_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Button onClick={handleAddQuizClose} color="secondary" sx={{ textTransform: 'none', marginRight: 2 }}>
            Cancel
          </Button>
          <Button onClick={handleAddQuizSubmit} color="primary" sx={{ textTransform: 'none' }}>
            Next
          </Button>
        </Box>
      </Dialog>
    </StyledContainer>
  );
};

export default QuizzesPage;
