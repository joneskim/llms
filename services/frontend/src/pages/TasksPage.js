// src/pages/TaskManagementPage.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import AddIcon from '@mui/icons-material/Add';
import {
  StyledContainer,
  Header,
  Title,
  SearchField,
  BackButton,
  ErrorBox,
} from './design/StyledComponents';
import { fetchTasks, addTask } from '../services/fakeApi';

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

const TaskManagementPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;

  // Add Task Modal State
  const [openAddModal, setOpenAddModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: '', description: '' });
  const [addTaskError, setAddTaskError] = useState('');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');

        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Filtering tasks based on search term
  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // Pagination Logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = filteredTasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleAddTask = () => {
    setOpenAddModal(true);
    setNewTask({ title: '', type: '', description: '' });
    setAddTaskError('');
  };

  const handleAddTaskClose = () => {
    setOpenAddModal(false);
    setNewTask({ title: '', type: '', description: '' });
    setAddTaskError('');
  };

  const handleAddTaskSubmit = async () => {
    const { title, type, description } = newTask;

    // Basic validation
    if (!title.trim() || !type.trim()) {
      setAddTaskError('Please fill in all required fields.');
      return;
    }

    try {
      const taskPayload = {
        title: title.trim(),
        type: type.trim(),
        description: description.trim(),
        // Add other necessary fields here
      };

      const addedTask = await addTask(taskPayload);
      setTasks([addedTask, ...tasks]); // Add new task to the top of the list
      handleAddTaskClose();
    } catch (err) {
      console.error('Error adding task:', err);
      setAddTaskError('Failed to add task. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
    setAddTaskError('');
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setTasks([]);
    // Re-fetch data
    const loadTasks = async () => {
      try {
        setLoading(true);
        setError('');

        const fetchedTasks = await fetchTasks();
        setTasks(fetchedTasks);
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
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
            <IconButton aria-label="refresh" color="inherit" size="small" onClick={handleRefresh}>
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
        <Title variant="h5">Task Management</Title>
      </Header>

      {/* Search Bar */}
      <SearchField
        variant="outlined"
        placeholder="Search tasks by title or type"
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
        aria-label="Search tasks"
      />

      {/* Tasks Table */}
      {currentTasks.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No tasks match your search criteria.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Task Title</StyledTableCell>
                <StyledTableCell>Task Type</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {currentTasks.map((task) => (
                <StyledTableRow key={task.id}>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>{task.type}</TableCell>
                  <TableCell>{task.description}</TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create Task Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddTask}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          fullWidth
          aria-label="Create new task"
        >
          Add New Task
        </Button>
      </Box>

      {/* Pagination Controls */}
      {filteredTasks.length > tasksPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={Math.ceil(filteredTasks.length / tasksPerPage)}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      {/* Add Task Dialog */}
      <Dialog open={openAddModal} onClose={handleAddTaskClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          {addTaskError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addTaskError}
            </Alert>
          )}
          <TextField
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
            required
            sx={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
            }}
          />
          <FormControl fullWidth margin="dense" variant="outlined" required>
            <InputLabel>Task Type</InputLabel>
            <Select
              name="type"
              value={newTask.type}
              onChange={handleInputChange}
              label="Task Type"
              sx={{
                backgroundColor: '#fafafa',
                borderRadius: '8px',
              }}
            >
              <MenuItem value="Assignment">Assignment</MenuItem>
              <MenuItem value="Typing Speed Test">Typing Speed Test</MenuItem>
              <MenuItem value="General Task">General Task</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            name="description"
            value={newTask.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            sx={{
              backgroundColor: '#fafafa',
              borderRadius: '8px',
              marginTop: '1rem',
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddTaskClose} color="secondary" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleAddTaskSubmit} color="primary" sx={{ textTransform: 'none' }}>
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default TaskManagementPage;
