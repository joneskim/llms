// src/components/ModulesPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from '@mui/material';
import { fetchModulesByCourseId, addModule } from '../services/fakeApi';

const ModulesPage = ({ courseId, onModuleSelect }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newModuleName, setNewModuleName] = useState('');
  const [addingModule, setAddingModule] = useState(false);

  // Fetch modules when component mounts
  useEffect(() => {
    const loadModules = async () => {
      try {
        const data = await fetchModulesByCourseId(courseId);
        setModules(data);
      } catch (err) {
        setError('Failed to load modules.');
      } finally {
        setLoading(false);
      }
    };
    loadModules();
  }, [courseId]);

  const handleAddModule = async () => {
    if (!newModuleName.trim()) {
      return;
    }

    setAddingModule(true);
    try {
      const newModule = await addModule(courseId, newModuleName);
      setModules([...modules, newModule]);
      setNewModuleName('');
    } catch (err) {
      setError('Failed to add new module.');
    } finally {
      setAddingModule(false);
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={2}>
        <CircularProgress />
        <Typography mt={2}>Loading modules...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Modules
      </Typography>

      <List>
        {modules.map((module) => (
          <ListItem button key={module.module_id} onClick={() => onModuleSelect(module)}>
            <ListItemText primary={module.module_name} />
          </ListItem>
        ))}
      </List>

      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Add New Module
        </Typography>
        <TextField
          label="Module Name"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddModule}
          disabled={addingModule}
          sx={{ mt: 2 }}
        >
          {addingModule ? 'Adding...' : 'Add Module'}
        </Button>
      </Box>
    </Box>
  );
};

export default ModulesPage;
