import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddLinkIcon from '@mui/icons-material/AddLink';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { fetchModulesByCourseId, fetchQuizzesByModuleId, fetchAssignmentsByModuleId } from '../services/fakeApi';

const ModulePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { courseId, moduleId } = useParams();
  const [module, setModule] = useState(location.state?.module);

  const [quizzes, setQuizzes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const loadModuleData = async () => {
      console.log('Course ID:', courseId);
      console.log('Module ID:', moduleId);
      console.log('Module from state:', module);
  
      if (!module) {
        const modules = await fetchModulesByCourseId(courseId);
        const foundModule = modules.find((mod) => mod.module_id === Number(moduleId));
        console.log('Fetched Modules:', modules);
        console.log('Found Module:', foundModule);
        setModule(foundModule);
      }
    };
  
    loadModuleData();
  }, [courseId, moduleId, module]);
  


  useEffect(() => {
    if (module) {
      const loadData = async () => {
        const quizzesData = await fetchQuizzesByModuleId(module.course_id, moduleId);
        setQuizzes(quizzesData);

        const assignments = await fetchAssignmentsByModuleId(module.course_id, moduleId);
        setPerformance(calculatePerformance(assignments, quizzesData));
      };

      loadData();
    }
  }, [module, moduleId]);

  if (!module) {
    return (
      <Box sx={{ padding: '2rem', textAlign: 'center' }}>
        <Typography variant="h4" color="error">
          Module Not Found
        </Typography>
        <Typography variant="body1">
          It seems like the module information is missing or incorrect.
        </Typography>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const handleCreateQuiz = () => {
    navigate(`/course/${courseId}/modules/${moduleId}/create-quiz`, { state: { module, courseId } });
  };

  const handleAddMaterial = () => {
    // Logic to handle adding materials (links or files)
  };

  const handleViewPerformance = () => {
    // Logic to handle viewing performance overview of quizzes for this module
  };

  const calculatePerformance = (assignments, quizzes) => {
    const totalScores = [...assignments, ...quizzes].map(item => item.score || 0);
    const overallAverage = totalScores.length ? (totalScores.reduce((a, b) => a + b, 0) / totalScores.length) : 0;
    const highestScore = Math.max(...totalScores);
    const lowestScore = Math.min(...totalScores);

    return {
      overallAverage,
      highestScore,
      lowestScore,
    };
  };

  return (
    <Box sx={{ padding: '2rem', backgroundColor: '#f7f9fc', borderRadius: '8px' }}>
      <Grid container justifyContent="space-between" alignItems="center" mb={3}>
        <Grid item>
          <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
            {module.module_name}
          </Typography>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ backgroundColor: '#2a2a3b', color: 'white' }}
          >
            Back to Course
          </Button>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ padding: '1rem', marginBottom: '2rem' }}>
        <Typography variant="h6" color="#2a2a3b" gutterBottom>
          Module Overview
        </Typography>
        <Typography variant="body1" color="#2a2a3b">
          {module.module_description || 'No description provided for this module.'}
        </Typography>
      </Paper>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ padding: '1rem', backgroundColor: '#fff' }}>
            <Typography variant="h6" color="#2a2a3b" gutterBottom>
              Quizzes
            </Typography>
            <Button
              variant="contained"
              startIcon={<QuizIcon />}
              onClick={handleCreateQuiz}
              sx={{ backgroundColor: '#2a2a3b', color: 'white', mb: 2 }}
              fullWidth
            >
              Create Quiz for this Module
            </Button>
            <List>
              {quizzes.length > 0 ? (
                quizzes.map(quiz => (
                  <ListItem key={quiz.quiz_id}>
                    <ListItemText
                      primary={quiz.quiz_title}
                      secondary={`Average Score: ${quiz.average_score || 'N/A'}`}
                    />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" color="#2a2a3b">No quizzes available.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={0} sx={{ padding: '1rem', backgroundColor: '#fff' }}>
            <Typography variant="h6" color="#2a2a3b" gutterBottom>
              Materials
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddLinkIcon />}
              onClick={handleAddMaterial}
              sx={{ backgroundColor: '#2a2a3b', color: 'white', mb: 2 }}
              fullWidth
            >
              Add Materials (Links/Files)
            </Button>
            <List>
              {materials.length > 0 ? (
                materials.map(material => (
                  <ListItem button component="a" href={material.material_url} target="_blank" key={material.material_id}>
                    <ListItemText primary={material.material_name} />
                  </ListItem>
                ))
              ) : (
                <Typography variant="body1" color="#2a2a3b">No materials available.</Typography>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      <Paper elevation={0} sx={{ padding: '1rem', backgroundColor: '#fff' }}>
        <Typography variant="h6" color="#2a2a3b" gutterBottom>
          Performance Overview
        </Typography>
        <Button
          variant="contained"
          startIcon={<AssessmentIcon />}
          onClick={handleViewPerformance}
          sx={{ backgroundColor: '#2a2a3b', color: 'white' }}
          fullWidth
        >
          View Quiz Performance
        </Button>
        <List sx={{ mt: 2 }}>
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
            <Typography variant="body1" color="#2a2a3b">No performance data available.</Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
};

export default ModulePage;
