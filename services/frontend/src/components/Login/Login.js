import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { validateTeacherLogin } from '../../services/fakeApi'; // Adjust path if needed

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const user = await validateTeacherLogin(username, password);

      if (user) {
        const teacherId = Number(user.id);
        if (!isNaN(teacherId)) {
          onLogin(teacherId);
          localStorage.setItem('teacher_id', teacherId);
          console.log(`Logged in as ${user.name}, ID: ${teacherId}`);
        } else {
          console.error('Failed to parse teacher ID as a number');
          setError('Unexpected error: Invalid user ID.');
        }
      } else {
        setError('Login failed: User not found or incorrect role.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={0}
      sx={{ backgroundColor: '#f7f9fc',
        
       }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '30%',
          borderRadius: 0,
          backgroundColor: '#ffffff',
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          borderRadius: 5,
        }}
      >
        <Box
          sx={{
            padding: '0.5rem 1rem',
            backgroundColor: '#2a2a3b',
            textAlign: 'center',
            marginBottom: '0.5rem',
            borderBottom: '1px solid #ccc',
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#ffffff',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: '600',
              letterSpacing: '0.5px',
            }}
          >
            Teacher Login
          </Typography>
        </Box>
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="dense"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{
            width: '70%',
            // center
            marginLeft: 'auto',
            marginRight: 'auto',
            input: { color: '#2a2a3b' },
            label: { color: '#555' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2a2a3b',
              },
            },
          }}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="dense"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{
            width: '70%',
            // center
            marginLeft: 'auto',
            marginRight: 'auto',
            input: { color: '#2a2a3b' },
            label: { color: '#555' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#ccc',
              },
              '&:hover fieldset': {
                borderColor: '#888',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#2a2a3b',
              },
            },
          }}
        />
        {error && (
          <Typography color="error" variant="body2" mt={1} align="center">
            {error}
          </Typography>
        )}
        <Button
          variant="contained"
          onClick={handleLogin}
          fullWidth
          sx={{
            width: '70%',
            // center
            marginLeft: 'auto',
            marginRight: 'auto',
            marginTop: '1rem',
            marginBottom: '1rem',
            backgroundColor: '#2a2a3b',
            color: '#ffffff',
            borderRadius: 10,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: '500',
            padding: '10px 0',
            '&:hover': {
              backgroundColor: '#1e1e2f',
            },
          }}
        >
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
