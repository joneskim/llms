// src/pages/QuizCreatePage.jsx

import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Typography,
  TextField,
  IconButton,
  Grid,
  Select,
  MenuItem,
  Tooltip,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import QuizIcon from '@mui/icons-material/Quiz';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  fetchQuizById,
  addQuizToModule,
  updateQuizInModule,
  fetchModulesByCourseId, // Ensure this is imported correctly
} from '../services/fakeApi';

import {
  StyledContainer,
  Header,
  Title,
  BackButton,
  ErrorBox,
  QuestionPaper,
  FormButton,
  DividerStyled,
} from './design/StyledComponents';

const QuizCreatePage = () => {
  const navigate = useNavigate();
  const { quizId, moduleId, courseId } = useParams();
  const location = useLocation();
  const module = location.state?.module || {};

  // State Variables
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [dueDate, setDueDate] = useState(null);
  const [quizLength, setQuizLength] = useState('');
  const [questions, setQuestions] = useState([
    {
      text: '',
      textAnswer: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      type: 'multipleChoice',
    },
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [moduleName, setModuleName] = useState('');
  const [error, setError] = useState('');

  // Fetch Quiz Details if Editing
  useEffect(() => {
    const loadQuizOrModule = async () => {
      if (quizId) {
        setIsEditing(true);
        try {
          const quiz = await fetchQuizById(quizId);
          setQuizTitle(quiz.quiz_name);
          setQuizDescription(quiz.description);
          setStartDate(quiz.start_date ? new Date(quiz.start_date) : null);
          setDueDate(quiz.due_date ? new Date(quiz.due_date) : null);
          setQuizLength(quiz.quiz_length || '');
          setQuestions(
            quiz.questions.map((q) => ({
              text: q.text,
              textAnswer: q.type === 'textAnswer' ? q.textAnswer : '',
              options:
                q.type === 'multipleChoice'
                  ? q.options.map((opt) => opt.text)
                  : ['', '', '', ''],
              correctIndex:
                q.type === 'multipleChoice'
                  ? q.options.findIndex((opt) => opt.correct === true)
                  : 0,
              type: q.type || 'multipleChoice',
            }))
          );
          setModuleName(quiz.moduleName || 'Unknown Module');
        } catch (err) {
          console.error('Error fetching quiz:', err);
          setError('Failed to load quiz details. Please try again.');
        }
      } else if (moduleId) {
        // Creating a new quiz for a module
        try {
          const modules = await fetchModulesByCourseId(courseId);
          const foundModule = modules.find((mod) => mod.id === moduleId);
          if (foundModule) {
            setModuleName(foundModule.module_name);
          } else {
            setModuleName('Unknown Module');
            setError('Module not found.');
          }
        } catch (err) {
          console.error('Error fetching module details:', err);
          setModuleName('Unknown Module');
          setError('Failed to load module details. Please try again.');
        }
      }
    };

    loadQuizOrModule();
  }, [quizId, moduleId, courseId]);

  // Handlers for Questions
  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        textAnswer: '',
        options: ['', '', '', ''],
        correctIndex: 0,
        type: 'multipleChoice',
      },
    ]);
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
            options: q.options.map((opt, idx) =>
              idx === optionIndex ? value : opt
            ),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex ? { ...q, correctIndex: parseInt(value, 10) } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === index
        ? {
            ...q,
            type: value,
            textAnswer: value === 'textAnswer' ? q.textAnswer : '',
            options: value === 'multipleChoice' ? q.options : ['', '', '', ''],
            correctIndex: value === 'multipleChoice' ? q.correctIndex : 0,
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length === 1) {
      alert('At least one question is required.');
      return;
    }
    setQuestions(questions.filter((_, i) => i !== index));
  };

  // Form Submission Handler
  const handleSubmit = async () => {
    // Basic validation
    if (!quizTitle.trim()) {
      setError('Quiz title is required.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) {
        setError(`Question ${i + 1} text is required.`);
        return;
      }
      if (q.type === 'multipleChoice') {
        if (q.options.some((opt) => !opt.trim())) {
          setError(`All options in Question ${i + 1} are required.`);
          return;
        }
      }
      if (q.type === 'textAnswer' && !q.textAnswer.trim()) {
        setError(`Answer for Question ${i + 1} is required.`);
        return;
      }
    }

    if (!startDate || !dueDate) {
      setError('Start date and due date are required.');
      return;
    }

    if (new Date(startDate) > new Date(dueDate)) {
      setError('Start date cannot be after due date.');
      return;
    }

    if (!quizLength || isNaN(quizLength) || parseInt(quizLength, 10) <= 0) {
      setError('Quiz length must be a positive number.');
      return;
    }

    // Prepare payload
    const formattedQuestions = questions.map((q) => ({
      text: q.text.trim(),
      type: q.type,
      textAnswer: q.type === 'textAnswer' ? q.textAnswer.trim() : undefined,
      options:
        q.type === 'multipleChoice'
          ? q.options.map((opt, idx) => ({
              text: opt.trim(),
              correct: idx === q.correctIndex,
            }))
          : undefined,
    }));

    const quizPayload = {
      module_id: moduleId,
      quiz_name: quizTitle.trim(),
      description: quizDescription.trim(),
      questions: formattedQuestions,
      start_date: startDate ? startDate.toISOString() : null,
      due_date: dueDate ? dueDate.toISOString() : null,
      quiz_length: parseInt(quizLength, 10),
    };

    try {
      setError('');
      if (isEditing) {
        await updateQuizInModule(quizId, quizPayload);
        alert('Quiz updated successfully!');
      } else {
        await addQuizToModule(quizPayload);
        alert('Quiz created successfully!');
      }
      navigate(`/course/${courseId}/modules/${moduleId}`, {
        state: { module: { ...module }, course_id: courseId },
      });
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError('An error occurred while saving the quiz. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledContainer>
      {/* Header Section */}
      <Header>
        <BackButton onClick={handleBack} aria-label="Go back">
          <ArrowBackIosNewIcon />
        </BackButton>
        <Title variant="h5">
          {isEditing ? `Edit Quiz: ${quizTitle}` : `Create Quiz for ${module?.module_name}`}
        </Title>
      </Header>

      {/* Quiz Creation Form */}
      <Box>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Quiz Title */}
        <TextField
          fullWidth
          variant="outlined"
          label="Quiz Title"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
          sx={{ marginBottom: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
        />

        {/* Quiz Description */}
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

        {/* Dates */}
        <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Start Date"
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Start Date"
                  sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}
                />
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <DatePicker
              selected={dueDate}
              onChange={(date) => setDueDate(date)}
              dateFormat="MM/dd/yyyy"
              placeholderText="Select Due Date"
              customInput={
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Due Date"
                  sx={{ backgroundColor: '#fafafa', borderRadius: '8px' }}
                />
              }
            />
          </Grid>
        </Grid>

        {/* Quiz Length */}
        <TextField
          fullWidth
          variant="outlined"
          label="Quiz Length (minutes)"
          type="number"
          value={quizLength}
          onChange={(e) => setQuizLength(e.target.value)}
          sx={{ marginTop: '1.5rem', marginBottom: '1.5rem', backgroundColor: '#fafafa', borderRadius: '8px' }}
          InputProps={{ inputProps: { min: 1 } }}
        />

        {/* Questions */}
        {questions.map((question, index) => (
          <QuestionPaper key={index}>
            <Grid container spacing={2} alignItems="center">
              {/* Question Text */}
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
              {/* Delete Question */}
              <Grid item xs={2} textAlign="right">
                <Tooltip title="Delete Question">
                  <IconButton onClick={() => handleDeleteQuestion(index)} sx={{ color: '#e74c3c' }}>
                    <DeleteOutlineIcon />
                  </IconButton>
                </Tooltip>
              </Grid>
              {/* Question Type */}
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

              {/* Text Answer Field */}
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

              {/* Multiple Choice Options */}
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
          </QuestionPaper>
        ))}

        <DividerStyled />

        {/* Add Question Button */}
        <FormButton
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddQuestion}
          bgcolor="#1abc9c"
          fullWidth
          aria-label="Add Another Question"
        >
          Add Another Question
        </FormButton>

        {/* Submit Button */}
        <FormButton
          variant="contained"
          startIcon={<QuizIcon />}
          onClick={handleSubmit}
          bgcolor="#2c3e50"
          fullWidth
          aria-label={isEditing ? 'Update Quiz' : 'Create Quiz'}
        >
          {isEditing ? 'Update Quiz' : 'Create Quiz'}
        </FormButton>
      </Box>
    </StyledContainer>
  );
};

export default QuizCreatePage;
