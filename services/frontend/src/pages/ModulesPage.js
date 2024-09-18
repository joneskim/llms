import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Pagination,
} from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  StyledContainer,
  Header,
  Title,
  SearchField,
  BackButton,
  ErrorBox,
} from './design/StyledComponents';
import { fetchModulesByCourseId, addModule, updateModule } from '../services/fakeApi';
import AddModuleModal from './AddModuleModal';

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

const ModulesPage = () => {
  const theme = useTheme();
  const { courseId } = useParams();  
  const navigate = useNavigate();

  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const modulesPerPage = 10;

  // Add/Edit Module Modal State
  const [openModuleModal, setOpenModuleModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      try {
        setLoading(true);
        setError('');
        const fetchedModules = await fetchModulesByCourseId(courseId);
        setModules(fetchedModules);
      } catch (error) {
        console.error('Error fetching modules:', error);
        setError('Failed to load modules. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadModules();
  }, [courseId]);

  const filteredModules = useMemo(() => {
    return modules.filter((module) =>
      module.module_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [modules, searchTerm]);

  const indexOfLastModule = currentPage * modulesPerPage;
  const indexOfFirstModule = indexOfLastModule - modulesPerPage;
  const currentModules = filteredModules.slice(indexOfFirstModule, indexOfLastModule);
  const totalPages = Math.ceil(filteredModules.length / modulesPerPage);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleEditModule = (event, module) => {
    event.stopPropagation();
    setSelectedModuleId(module.id);
    setOpenModuleModal(true);
  };

  const handleOpenModule = (module) => {
    navigate(`/course/${courseId}/modules/${module.id}`, {
      state: { module, courseId },
    });
  };

  const handleCreateModule = () => {
    setSelectedModuleId('');
    setOpenModuleModal(true);
  };

  const handleModuleSubmit = async (newModuleData) => {
    if (!newModuleData.module_name || !newModuleData.course_id) {
      alert('Module name and course ID are required.');
      return;
    }

    try {
      if (selectedModuleId) {
        await updateModule(selectedModuleId, {
          module_name: newModuleData.module_name,
          description: newModuleData.description,
        });
        setModules((prevModules) =>
          prevModules.map((mod) =>
            mod.id === selectedModuleId ? { ...mod, module_name: newModuleData.module_name } : mod
          )
        );
      } else {
        console.log('Creating new module:', newModuleData);
        const newModule = await addModule(newModuleData.course_id, newModuleData.module_name, newModuleData.description
        );
        console.log('New module:', newModule);
        setModules((prevModules) => [...prevModules, newModule]);
      }

      setOpenModuleModal(false);
    } catch (err) {
      console.error('Error saving module:', err);
      alert('Failed to save module. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <StyledContainer>
      <Header>
        <BackButton onClick={handleBack} aria-label="Go back">
          <ArrowBackIosNewIcon />
        </BackButton>
        <Title variant="h5">Modules</Title>
      </Header>

      <SearchField
        variant="outlined"
        placeholder="Search modules..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
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

      {currentModules.length === 0 ? (
        <Typography variant="body1" color="textSecondary" align="center">
          No modules match your search criteria.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={1}>
          <Table>
            <StyledTableHead>
              <TableRow>
                <StyledTableCell>Module Name</StyledTableCell>
                <StyledTableCell>Actions</StyledTableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {currentModules.map((module) => (
                <StyledTableRow key={module.id} onClick={() => handleOpenModule(module)}>
                  <TableCell>{module.module_name}</TableCell>
                  <TableCell>
                    <IconButton
                      aria-label="edit module"
                      onClick={(e) => handleEditModule(e, module)}
                      sx={{ color: theme.palette.primary.main }}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Box mt={4}>
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleCreateModule}
          sx={{
            textTransform: 'none',
            fontWeight: 'bold',
            borderRadius: '8px',
            padding: '10px 20px',
          }}
          fullWidth
          aria-label="Create new module"
        >
          Create New Module
        </Button>
      </Box>

      {filteredModules.length > modulesPerPage && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}

      <AddModuleModal
        open={openModuleModal}
        onClose={() => setOpenModuleModal(false)}
        onAddModule={handleModuleSubmit}  
        courseId={courseId}  
      />
    </StyledContainer>
  );
};

export default ModulesPage;
