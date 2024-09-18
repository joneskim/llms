import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Fade,
  Grid,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  padding: theme.spacing(4),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const AddModuleModal = ({ open, onClose, onAddModule, courseId }) => {
  const [moduleName, setModuleName] = useState('');
  const [description, setDescription] = useState('');

  const handleAddModule = () => {
    if (moduleName.trim() === '') {
      alert('Please fill in all required fields.');
      return;
    }
  
    // Send data without nesting module_name and description
    onAddModule({
      course_id: courseId,
      module_name: moduleName,
      description: description,
    });
  
    // Clear fields after submission
    setModuleName('');
    setDescription('');
  
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <ModalContainer>
          <Header>
            <Typography variant="h6">Create New Module</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Header>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Module Name"
                value={moduleName}
                onChange={(e) => setModuleName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleAddModule}>
              Add Module
            </Button>
          </Box>
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

export default AddModuleModal;
