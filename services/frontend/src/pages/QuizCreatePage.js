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
  Box,
  FormControl,
  InputLabel,
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { fetchQuizById, addQuizToModule, updateQuizInModule } from '../services/fakeApi';

const QuizCreatePage = () => {
  const { quizId, moduleId, courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state?.module || {};

  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [quizLength, setQuizLength] = useState('');
  const [questions, setQuestions] = useState([
    { text: '', textAnswer: '', options: ['', '', '', ''], correctIndex: 0, type: 'multipleChoice' },
  ]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (quizId) {
      const loadQuiz = async () => {
        const quiz = await fetchQuizById(quizId);
        setQuizTitle(quiz.quiz_name);
        setQuizDescription(quiz.description);
        setStartDate(quiz.startDate ? new Date(quiz.startDate) : null);
        setDueDate(quiz.dueDate ? new Date(quiz.dueDate) : null);
        setQuizLength(quiz.quiz_length || '');
        setQuestions(
          quiz.questions.map((q) => ({
            text: q.question_text,
            textAnswer: q.textAnswer || '',
            options: q.options.map((opt) => opt.answer_text),
            correctIndex: q.options.findIndex((opt) => opt.correct === 1),
            type: q.question_type,
          }))
        );
        setIsEditing(true);
      };

      loadQuiz();
    }
  }, [quizId]);

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
        const formattedQuestions = questions.map((q) => ({
            question_text: q.text,
            question_type: q.type,
            textAnswer: q.type === 'textAnswer' ? q.textAnswer : undefined,
            options: q.type === 'multipleChoice'
                ? q.options.map((opt, index) => ({
                    answer_text: opt,
                    correct: q.correctIndex === index,
                }))
                : undefined,
        }));
        
        const quizPayload = {
            module_id: moduleId,
            quiz_name: quizTitle,
            description: quizDescription,
            questions: formattedQuestions,
            start_date: startDate ? startDate.toISOString() : null,
            due_date: dueDate ? dueDate.toISOString() : null,
            quiz_length: quizLength,
        };

        try {
            if (isEditing) {
                await updateQuizInModule(parseInt(quizId), quizPayload);
            } else {
                await addQuizToModule(quizPayload);
            }

            navigate(`/course/${courseId}/modules/${moduleId}`, {
                state: { module: { ...module }, course_id: courseId },
            });
        } catch (error) {
            console.error('Error saving quiz:', error);
            alert('An error occurred while saving the quiz.');
        }
    } else {
        alert('Please provide a quiz title.');
    }
};


  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)' }}>
      <Typography variant="h5" color="#2c3e50" fontWeight="bold" gutterBottom>
        {isEditing ? `Edit Quiz: ${quizTitle}` : `Create Quiz for ${module?.module_name}`}
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        label="Quiz Title"
        value={quizTitle}
        onChange={(e) => setQuizTitle(e.target.value)}
        sx={{ marginBottom: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
      />

      <TextField
        fullWidth
        variant="outlined"
        label="Quiz Description"
        value={quizDescription}
        onChange={(e) => setQuizDescription(e.target.value)}
        multiline
        rows={3}
        sx={{ marginBottom: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
      />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select Start Date"
            customInput={<TextField fullWidth variant="outlined" label="Start Date" sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }} />}
          />
        </Grid>
        <Grid item xs={6}>
          <DatePicker
            selected={dueDate}
            onChange={(date) => setDueDate(date)}
            dateFormat="MM/dd/yyyy"
            placeholderText="Select Due Date"
            customInput={<TextField fullWidth variant="outlined" label="Due Date" sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }} />}
          />
        </Grid>
      </Grid>

      <TextField
        fullWidth
        variant="outlined"
        label="Quiz Length (minutes)"
        value={quizLength}
        onChange={(e) => setQuizLength(e.target.value)}
        sx={{ marginTop: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
      />

      {questions.map((question, index) => (
        <Paper
          key={index}
          sx={{
            padding: '1.5rem',
            marginBottom: '1.5rem',
            backgroundColor: '#f7f7f7',
            borderRadius: '12px',
            border: '1px solid #ddd',
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
                sx={{ marginBottom: '1rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
              />
            </Grid>
            <Grid item xs={2} textAlign="right">
              <Tooltip title="Delete Question">
                <IconButton onClick={() => handleDeleteQuestion(index)} sx={{ color: '#e74c3c' }}>
                  <DeleteOutlineIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth sx={{ marginBottom: '1rem', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <InputLabel id={`question-type-label-${index}`}>Question Type</InputLabel>
                <Select
                  labelId={`question-type-label-${index}`}
                  value={question.type}
                  onChange={(e) => handleQuestionTypeChange(index, e.target.value)}
                  label="Question Type"
                >
                  <MenuItem value="multipleChoice">Multiple Choice</MenuItem>
                  <MenuItem value="textAnswer">Text Answer</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {question.type === 'textAnswer' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Answer"
                  value={question.textAnswer}
                  onChange={(e) => handleTextAnswerChange(index, e.target.value)}
                  sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}
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
                      sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}
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
          backgroundColor: '#1abc9c',
          color: 'white',
          marginBottom: '1.5rem',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          textTransform: 'none',
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
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
          textTransform: 'none',
        }}
        fullWidth
      >
        {isEditing ? 'Update Quiz' : 'Create Quiz'}
      </Button>
    </Container>
  );
};

export default QuizCreatePage;
