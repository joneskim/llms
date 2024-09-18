import React, { useState } from 'react'; // Ensure useState is imported
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Fade,
  Grid,
} from '@mui/material'; // Ensure all material UI components are imported
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close'; // Ensure CloseIcon is imported

// Styled Components
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

const AddStudentModal = ({ open, onClose, onAddStudent }) => {
  const [studentName, setStudentName] = useState('');

  const handleAddStudent = () => {
    if (studentName.trim() === '') {
      alert('Please fill in the student name.');
      return;
    }

    // Pass the name to the onAddStudent function
    onAddStudent({
      name: studentName.trim(),
    });

    // Clear input after submission
    setStudentName('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <ModalContainer>
          <Header>
            <Typography variant="h6">Add New Student</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Header>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Student Name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                variant="outlined"
                required
              />
            </Grid>
          </Grid>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={handleAddStudent}>
              Add Student
            </Button>
          </Box>
        </ModalContainer>
      </Fade>
    </Modal>
  );
};

export default AddStudentModal;
