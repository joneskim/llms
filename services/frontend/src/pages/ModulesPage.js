// src/components/ModulesPage.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { fetchModulesByCourseId, addModule } from '../services/fakeApi';
import {
  StyledContainer,
  Header,
  Title,
  SearchField,
  BackButton,
  ErrorBox,
} from './design/StyledComponents';



const ModuleList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
  padding: 0,
}));

const ModuleListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  cursor: 'pointer',
}));

const CreateModuleSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
}));

const ModulesPage = ({ courseId }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [editModuleName, setEditModuleName] = useState('');
  const [editModuleId, setEditModuleId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedModules = await fetchModulesByCourseId(courseId);
        setModules(fetchedModules);
      } catch (err) {
        console.error('Error fetching modules:', err);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (newModuleName.trim() === '') {
      setError('Module name cannot be empty.');
      return;
    }
    try {
      const newModule = await addModule(courseId, newModuleName.trim());
      if (newModule) {
        setModules([...modules, newModule]);
        setNewModuleName('');
        setError('');
      }
    } catch (err) {
      console.error('Error adding module:', err);
      setError('Failed to add module. Please try again.');
    }
  };

  const handleOpenModule = (module) => {
    navigate(`/course/${courseId}/modules/${module.id}`, { state: { module, courseId } });
  };

  const handleEditModule = (module) => {
    setEditModuleName(module.module_name);
    setEditModuleId(module.id);
    setEditDialogOpen(true);
  };

  const handleSaveEditModule = async () => {
    if (editModuleName.trim() === '') {
      setError('Module name cannot be empty.');
      return;
    }
    try {
      // Assuming you have an API endpoint to update the module name
      // Replace `updateModule` with your actual API call
      // await updateModule(editModuleId, editModuleName.trim());

      // For demonstration, we'll just update the local state
      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod.id === editModuleId ? { ...mod, module_name: editModuleName.trim() } : mod
        )
      );
      setEditDialogOpen(false);
      setEditModuleName('');
      setEditModuleId(null);
      setError('');
    } catch (err) {
      console.error('Error updating module:', err);
      setError('Failed to update module. Please try again.');
    }
  };

  const handleDeleteModule = (moduleId) => {
    // Assuming you have an API endpoint to delete the module
    // Replace `deleteModule` with your actual API call
    // await deleteModule(moduleId);

    // For demonstration, we'll just update the local state
    setModules((prevModules) => prevModules.filter((mod) => mod.id !== moduleId));
  };

  const filteredModules = modules.filter((module) =>
    module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <Title variant="h5">Modules</Title>
      </Header>

      {/* Search Bar */}
      <SearchField
        variant="outlined"
        placeholder="Search modules..."
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
        aria-label="Search modules"
      />

      {/* Loading Indicator */}
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <Alert severity="error">{error}</Alert>
        </Box>
      ) : (
        <>
          {/* Modules List */}
          <ModuleList>
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <ModuleListItem
                  key={module.id}
                  onClick={() => handleOpenModule(module)}
                  secondaryAction={
                    <Box>
                      <IconButton
                        edge="end"
                        aria-label="edit module"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(module);
                        }}
                        sx={{ color: theme.palette.text.primary }}
                      >
                        <EditOutlinedIcon />
                      </IconButton>
                      <IconButton
                        edge="end"
                        aria-label="delete module"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModule(module.id);
                        }}
                        sx={{ color: theme.palette.error.main }}
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText primary={module.module_name} />
                </ModuleListItem>
              ))
            ) : (
              <Typography variant="body1" color="textSecondary" align="center">
                No modules found.
              </Typography>
            )}
          </ModuleList>

          {/* Create Module Section */}
          <CreateModuleSection>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Create a New Module
            </Typography>
            <Paper sx={{ padding: 2, borderRadius: '8px', backgroundColor: theme.palette.background.paper }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter module name"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                size="small"
                sx={{ marginBottom: 2, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
              />
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleCreateModule}
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  width: '100%',
                }}
                aria-label="Create new module"
              >
                Create Module
              </Button>
            </Paper>
          </CreateModuleSection>

          {/* Edit Module Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            aria-labelledby="edit-module-dialog-title"
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle id="edit-module-dialog-title">Edit Module Name</DialogTitle>
            <DialogContent>
              <TextField
                fullWidth
                variant="outlined"
                label="Module name"
                value={editModuleName}
                onChange={(e) => setEditModuleName(e.target.value)}
                size="small"
                sx={{ marginTop: 1, backgroundColor: theme.palette.background.paper, borderRadius: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="secondary" sx={{ textTransform: 'none' }}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditModule} color="primary" sx={{ textTransform: 'none' }}>
                Save
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </StyledContainer>
  );
};

export default ModulesPage;
