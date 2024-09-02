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
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { fetchTasks, addTask } from '../services/fakeApi'; // Replace with your actual import paths

const TaskManagementPage = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);
  const [openModal, setOpenModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', type: '', description: '' });

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const loadedTasks = await fetchTasks();
        setTasks(loadedTasks);
      } catch (err) {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks
    .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(indexOfFirstTask, indexOfLastTask);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setNewTask({ title: '', type: '', description: '' });
  };

  const handleTaskSubmit = async () => {
    try {
      await addTask(newTask);
      setTasks([...tasks, newTask]);
      handleModalClose();
    } catch (err) {
      setError('Failed to add task.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask, 
      [name]: value,
    }));
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
        Task Management
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search tasks..."
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
                Task Title
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
                Task Type
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentTasks.length > 0 ? (
              currentTasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell sx={{ color: '#2a2a3b' }}>{task.title}</TableCell>
                  <TableCell sx={{ color: '#2a2a3b' }}>{task.type}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No tasks available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(tasks.length / tasksPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      />

<Box display="flex" justifyContent="center" mt={4}>
  <Button 
    variant="contained" 
    sx={{ backgroundColor: '#2a2a3b', color: 'white' }} 
    onClick={handleModalOpen}
  >
    Add New Task
  </Button>
</Box>


      <Dialog open={openModal} onClose={handleModalClose}>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Task Title"
            type="text"
            fullWidth
            variant="outlined"
            name="title"
            value={newTask.title}
            onChange={handleInputChange}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Task Type</InputLabel>
            <Select
              name="type"
              value={newTask.type}
              onChange={handleInputChange}
              variant="outlined"
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleTaskSubmit} color="primary">
            Add Task
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TaskManagementPage;
