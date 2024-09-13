import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { validateTeacherLogin } from '../../services/fakeApi'; // Adjust path if needed
import Cookies from 'js-cookie';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      // Call the API with both username and password
      const response = await validateTeacherLogin(username, password);

      // Log the API response to inspect the structure
      console.log('Login response:', response);

      if (response && response.message === 'Login successful') {
        const { sessionToken, teacher } = response;

        // Store the session token and teacher ID in cookies
        Cookies.set('sessionToken', sessionToken);
        Cookies.set('teacher_id', teacher.id);

        // Pass the teacher ID to the parent component's login handler
        console.log(`Logged in successfully with teacher ID: ${teacher.id}`);
        onLogin(teacher.id);

        console.log(`Logged in successfully with token: ${sessionToken}`);
      } else {
        setError('Login failed: Incorrect credentials or server error.');
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
      sx={{ backgroundColor: '#f7f9fc' }}
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
            borderTopRightRadius: 15,
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
