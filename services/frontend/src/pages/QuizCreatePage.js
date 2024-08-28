import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Select,
  MenuItem,
  Paper,
  Divider,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import { addQuizToModule } from '../services/fakeApi';
import TextAnswerEditor from '../components/TextAnswerEditor';

const QuizCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { moduleId, courseId } = useParams(); // Extract courseId and moduleId from URL parameters
  const module = location.state?.module || {}; // Default to an empty object to avoid undefined errors
  const course_Id = location.state?.courseId;
  const [quizDescription, setQuizDescription] = useState(''); // Add this line

  console.log('Module from state:', module);

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', textAnswer: '', options: ['', '', '', ''], correctIndex: 0, type: 'multipleChoice' },
  ]);

  // Debugging: Check courseId and module object on load
  useEffect(() => {
    console.log('Params:', { courseId, moduleId });
    console.log('Module from state:', module);
    if (!courseId && module?.course_id) {
      console.warn('Course ID missing in params, using course_id from module object');
    }
  }, [courseId, module]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', textAnswer: '', options: ['', '', '', ''], correctIndex: 0, type: 'multipleChoice' }]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, text: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleTextAnswerChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, textAnswer: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex ? { ...q, correctIndex: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index ? { ...q, type: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (module && quizTitle) {
      const formattedQuestions = questions.map((q) => {
        const optionsArray = Array.isArray(q.options) ? q.options : [];
        return {
          text: q.text,
          textAnswer: q.textAnswer,
          options: optionsArray.map((option, index) => ({
            text: option,
            correct: q.correctIndex === index,
          })),
        };
      });
  
      const usedCourseId = courseId || course_Id;
      if (!usedCourseId) {
        console.error('Error: course_id is missing!');
        alert('Course ID is missing. Please ensure the correct module is loaded.');
        return;
      }
  
      console.log('About to add quiz with:', {
        courseId: usedCourseId,
        moduleId: module.id,
        quizTitle,
        quizDescription, // Include this in the console log
        formattedQuestions,
      });
  
      try {
        const added = await addQuizToModule(module.id, quizTitle, quizDescription, formattedQuestions); // Pass quizDescription
        console.log('Quiz added:', added);
        alert(`Quiz "${quizTitle}" created for ${module.module_name}`);
        
        navigate(`/course/${usedCourseId}/modules/${module.id}`, {
          state: { module: { ...module }, course_id: usedCourseId },
        });
      } catch (error) {
        console.error('Error adding quiz:', error);
        alert('An error occurred while adding the quiz.');
      }
    } else {
      alert('Please provide a quiz title.');
    }
  };
  
  

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', padding: '2rem' }}>
      <Typography variant="h4" color="#333" fontWeight="bold" gutterBottom>
        Create Quiz for {module?.module_name}
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        sx={{ marginBottom: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}
      />

<TextField
  fullWidth
  variant="outlined"
  label="Quiz Description"
  value={quizDescription}
  onChange={(e) => setQuizDescription(e.target.value)}
  sx={{ marginBottom: '1.5rem', backgroundColor: '#fff', borderRadius: '8px' }}
/>


      {questions.map((question, index) => (
        <Paper
          key={index}
          sx={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#fff',
            borderRadius: '8px',
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={10}>
              <TextField
                fullWidth
                variant="outlined"
                label={`Question ${index + 1}`}
                value={question.text}
                onChange={(e) => handleQuestionChange(index, e.target.value)}
                sx={{ marginBottom: '1rem', backgroundColor: '#fafafa' }}
              />
            </Grid>
            <Grid item xs={2} textAlign="right">
              <Tooltip title="Delete Question">
                <IconButton onClick={() => handleDeleteQuestion(index)} sx={{ color: '#d9534f' }}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Question Type
              </Typography>
              <Select
                fullWidth
                value={question.type}
                onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
                sx={{ marginBottom: '1rem', backgroundColor: '#fafafa' }}
              >
                <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                <MenuItem value="textAnswer">Text Answer</MenuItem>
              </Select>
            </Grid>

            {question.type === 'textAnswer' && (
              <Grid item xs={12}>
                <TextAnswerEditor
                  value={question.textAnswer}
                  onChange={(value) => handleTextAnswerChange(index, value)}
                />
              </Grid>
            )}

            {question.type === 'multipleChoice' &&
              question.options.map((option, optIndex) => (
                <Grid container key={optIndex} alignItems="center" sx={{ marginBottom: '0.5rem' }}>
                  <Grid item xs={8}>
                    <TextField
                      fullWidth
                      variant="outlined"
                      label={`Option ${optIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                      sx={{ backgroundColor: '#f7f7f7' }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <RadioGroup
                      row
                      value={question.correctIndex}
                      onChange={() => handleCorrectOptionChange(index, optIndex)}
                    >
                      <FormControlLabel
                        value={optIndex}
                        control={<Radio />}
                        label="Correct"
                        sx={{ marginLeft: '0.5rem' }}
                      />
                    </RadioGroup>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Paper>
      ))}

      <Divider sx={{ marginBottom: '1.5rem' }} />

      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddQuestion}
        sx={{
          backgroundColor: '#27ae60',
          color: 'white',
          marginBottom: '1.5rem',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
        }}
        fullWidth
      >
        Add Another Question
      </Button>

      <Button
        variant="contained"
        startIcon={<QuizIcon />}
        onClick={handleSubmit}
        sx={{
          backgroundColor: '#34495e',
          color: 'white',
          boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
        }}
        fullWidth
      >
        Create Quiz
      </Button>
    </Container>
  );
};

export default QuizCreatePage;
