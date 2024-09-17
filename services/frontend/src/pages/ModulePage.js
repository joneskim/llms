import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  IconButton,
  TextField,
  InputAdornment,
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { fetchModulesByCourseId, fetchQuizzesByModuleId, fetchAssignmentsByModuleId } from '../services/fakeApi';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
}));

const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
}));

const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

const QuizList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const QuizListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ModulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(location.state?.module || {});
  const usedModuleId = moduleId || module.id;
  const usedCourseId = courseId || module.course_id;

  const [quizzes, setQuizzes] = useState([]);
  const [performance, setPerformance] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadModuleData = async () => {
      if (!module.id) {
        try {
          const modules = await fetchModulesByCourseId(usedCourseId);
          const foundModule = modules.find((mod) => mod.id === usedModuleId);
          if (foundModule) {
            setModule(foundModule);
          } else {
            console.error('Module not found');
          }
        } catch (error) {
          console.error('Error fetching modules:', error);
        }
      }
    };

    loadModuleData();
  }, [usedCourseId, usedModuleId, module]);

  useEffect(() => {
    const loadData = async () => {
      if (module.id) {
        try {
          setLoading(true);
          const quizzesData = await fetchQuizzesByModuleId(module.id);

          // Sort quizzes by creation date descending (newest first)
          const sortedQuizzes = quizzesData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setQuizzes(sortedQuizzes);

          const assignments = await fetchAssignmentsByModuleId(module.id);
          setPerformance(calculatePerformance(assignments, sortedQuizzes));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadData();
  }, [module]);

  const calculatePerformance = (assignments, quizzes) => {
    const totalScores = [...assignments, ...quizzes].map((item) => item.score || 0);
    const overallAverage = totalScores.length
      ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length).toFixed(2)
      : 0;
    const highestScore = totalScores.length ? Math.max(...totalScores) : 0;
    const lowestScore = totalScores.length ? Math.min(...totalScores) : 0;

    return {
      overallAverage,
      highestScore,
      lowestScore,
    };
  };

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.quiz_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledContainer maxWidth="md">
      {/* Header Section */}
      <Header>
        <IconButton onClick={handleBack} aria-label="Go back">
          <ArrowBackIosNewIcon />
        </IconButton>
        <Title variant="h5">Quizzes for {module.module_name}</Title>
      </Header>

      {/* Search Bar */}
      <SearchField
        variant="outlined"
        placeholder="Search quizzes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Quizzes List */}
          <QuizList>
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <QuizListItem
                  key={quiz.id}
                  button
                  onClick={() => handleTakeQuiz(quiz)}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      aria-label="edit quiz"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditQuiz(quiz);
                      }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  }
                >
                  <ListItemText primary={quiz.quiz_name} />
                </QuizListItem>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No quizzes found.
              </Typography>
            )}
          </QuizList>

          {/* Create Quiz Button */}
          <Button
            variant="contained"
            startIcon={<QuizIcon />}
            onClick={handleCreateQuiz}
            sx={{
              backgroundColor: '#1976d2',
              color: '#fff',
              marginTop: 3,
              textTransform: 'none',
              fontWeight: 'bold',
              padding: '12px 24px',
              borderRadius: '8px',
            }}
            fullWidth
            aria-label="Create new quiz"
          >
            Create New Quiz
          </Button>

          {/* Performance Overview */}
          <Box mt={5}>
            <Typography variant="h6" color="textPrimary" fontWeight="bold" gutterBottom>
              Performance Overview
            </Typography>
            <Paper elevation={1} sx={{ padding: 2, borderRadius: '8px' }}>
              {performance ? (
                <List disablePadding>
                  <ListItem disableGutters>
                    <ListItemText primary="Overall Average" />
                    <Typography variant="subtitle1" color="textSecondary">
                      {performance.overallAverage}%
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Highest Score" />
                    <Typography variant="subtitle1" color="textSecondary">
                      {performance.highestScore}%
                    </Typography>
                  </ListItem>
                  <Divider />
                  <ListItem disableGutters>
                    <ListItemText primary="Lowest Score" />
                    <Typography variant="subtitle1" color="textSecondary">
                      {performance.lowestScore}%
                    </Typography>
                  </ListItem>
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No performance data available.
                </Typography>
              )}
            </Paper>
          </Box>
        </>
      )}
    </StyledContainer>
  );
};

export default ModulePage;
