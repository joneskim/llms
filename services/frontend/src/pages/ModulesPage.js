import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchModulesByCourseId, addModule } from '../services/fakeApi';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Box,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

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

const ModuleList = styled(List)(({ theme }) => ({
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

const ModuleListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(1),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const ModulesPage = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [editModuleName, setEditModuleName] = useState('');
  const [editModuleId, setEditModuleId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModules = async () => {
      setLoading(true);
      const fetchedModules = await fetchModulesByCourseId(courseId);
      setModules(fetchedModules);
      setLoading(false);
    };

    fetchModules();
  }, [courseId]);

  const handleCreateModule = async () => {
    if (newModuleName) {
      const newModule = await addModule(courseId, newModuleName);
      if (newModule) {
        setModules([...modules, newModule]);
        setNewModuleName('');
      }
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

  const handleSaveEditModule = () => {
    setModules((prevModules) =>
      prevModules.map((mod) =>
        mod.id === editModuleId ? { ...mod, module_name: editModuleName } : mod
      )
    );
    setEditDialogOpen(false);
  };

  const handleDeleteModule = (moduleId) => {
    setModules((prevModules) => prevModules.filter((mod) => mod.id !== moduleId));
  };

  const filteredModules = modules.filter((module) =>
    module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      ) : (
        <>
          {/* Modules List */}
          <ModuleList>
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <ModuleListItem
                  key={module.id}
                  button
                  onClick={() => handleOpenModule(module)}
                  secondaryAction={
                    <>
                      <IconButton
                        edge="end"
                        aria-label="edit module"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModule(module);
                        }}
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
                      >
                        <DeleteOutlineIcon />
                      </IconButton>
                    </>
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
          <Box mt={5}>
            <Typography variant="h6" color="textPrimary" gutterBottom>
              Create a New Module
            </Typography>
            <Paper elevation={1} sx={{ padding: 2, borderRadius: '8px' }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter module name"
                value={newModuleName}
                onChange={(e) => setNewModuleName(e.target.value)}
                size="small"
                sx={{ marginBottom: 2, backgroundColor: 'white' }}
              />
              <Button
                variant="contained"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleCreateModule}
                sx={{
                  backgroundColor: '#1976d2',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  padding: '10px 20px',
                  borderRadius: '8px',
                }}
                fullWidth
                aria-label="Create new module"
              >
                Create Module
              </Button>
            </Paper>
          </Box>

          {/* Edit Module Dialog */}
          <Dialog
            open={editDialogOpen}
            onClose={() => setEditDialogOpen(false)}
            aria-labelledby="edit-module-dialog-title"
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
                sx={{ marginTop: 1 }}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={handleSaveEditModule} color="primary">
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
