import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Fade,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

// Styled components
const ModalContainer = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
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

// Function to generate a 6-character alphanumeric ID
const generateUniqueId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let uniqueId = '';
  for (let i = 0; i < 6; i++) {
    uniqueId += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uniqueId;
};

const AddStudentModal = ({ open, onClose, onAddStudent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [uniqueId, setUniqueId] = useState('');

  // Generate a unique ID when the modal opens
  useEffect(() => {
    if (open) {
      setUniqueId(generateUniqueId());
    }
  }, [open]);

  const handleAddStudent = () => {
    if (name && email) {
      onAddStudent({ name, email, uniqueId });
      onClose();
    } else {
      alert('Please fill in all fields.');
    }
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
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Unique ID"
            value={uniqueId}
            margin="normal"
            disabled
          />
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
