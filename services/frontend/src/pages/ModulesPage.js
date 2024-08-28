import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchModulesByCourseId, addModule } from '../services/fakeApi';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tooltip,
  InputAdornment,
  Pagination,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';

const ModulesPage = ({ courseId }) => {
  const [modules, setModules] = useState([]);
  const [newModuleName, setNewModuleName] = useState('');
  const [editModuleName, setEditModuleName] = useState('');
  const [editModuleId, setEditModuleId] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [modulesPerPage] = useState(10); // Number of modules per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchModules = async () => {
      const fetchedModules = await fetchModulesByCourseId(courseId);
      setModules(fetchedModules);
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

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredModules = modules.filter((module) =>
    module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const indexOfLastModule = currentPage * modulesPerPage;
  const indexOfFirstModule = indexOfLastModule - modulesPerPage;
  const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);

  return (
    <Container maxWidth="lg" sx={{ marginTop: '2rem', padding: '2rem', borderRadius: '8px', backgroundColor: '#f7f9fc' }}>
      <Typography variant="h4" color="#2a2a3b" fontWeight="bold" mb={3}>
        Modules
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search modules..."
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
                Module Name
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  color: '#ffffff',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderBottom: 'none',
                  padding: '16px',
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentModules.map((module) => (
              <TableRow key={module.id}>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ cursor: 'pointer', color: '#2a2a3b' }}
                  onClick={() => handleOpenModule(module)}
                >
                  {module.module_name}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Module" placement="top">
                    <IconButton onClick={() => handleEditModule(module)} sx={{ color: '#1abc9c' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Module" placement="top">
                    <IconButton onClick={() => handleDeleteModule(module.id)} sx={{ color: '#e74c3c' }}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filteredModules.length / modulesPerPage)}
        page={currentPage}
        onChange={handlePageChange}
        color="primary"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
      />

      <Box mt={5}>
        <Typography variant="h6" color="#2a2a3b" gutterBottom>
          Create a New Module
        </Typography>
        <TextField
          fullWidth
          variant="outlined"
          label="Enter module name"
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          sx={{ marginBottom: '1rem', backgroundColor: 'white' }}
          size="small"
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#2a2a3b', color: 'white' }}
          fullWidth
          onClick={handleCreateModule}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
        >
          Create Module
        </Button>
      </Box>

      {/* Edit Module Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Module Name</DialogTitle>
        <DialogContent sx={{ backgroundColor: '#f7f9fc' }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Module name"
            value={editModuleName}
            onChange={(e) => setEditModuleName(e.target.value)}
            sx={{ backgroundColor: 'white' }}
          />
        </DialogContent>
        <DialogActions sx={{ backgroundColor: '#f7f9fc' }}>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEditModule} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ModulesPage;
