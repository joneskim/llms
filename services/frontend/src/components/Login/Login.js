// components/Login.js
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
  Checkbox,
  FormControlLabel,
  Alert,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/system';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { validateTeacherLogin } from '../../services/fakeApi'; // Adjust the path as needed
import { useNavigate } from 'react-router-dom';

// Styled Components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  maxWidth: 400,
  width: '100%',
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 30px rgba(0,0,0,0.1)',
  backgroundColor: '#1e1e2f',
  color: '#ffffff',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(3),
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  backgroundColor: '#3f51b5',
  color: '#ffffff',
  fontWeight: 600,
  fontSize: '1rem',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const InputField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#555',
    },
    '&:hover fieldset': {
      borderColor: '#3f51b5',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3f51b5',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#ccc',
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: '#fff',
  },
  '& .MuiOutlinedInput-input': {
    color: '#fff',
  },
}));

const Login = ({ onLogin }) => {
  // State Management
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  // Handler for login submission
  const handleLogin = async () => {
    setError('');

    // Basic client-side validation
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await validateTeacherLogin(username, password);
      console.log('Login response:', response);

      if (response && response.session_token && response.teacherId) {
        // Successful login
        if (onLogin) {
          onLogin(response.teacherId);
        }
        console.log(`Logged in successfully with teacher ID: ${response.teacherId}`);

        // Redirect to dashboard or desired page
        navigate('/dashboard');
      } else {
        // Handle login failure
        setError(response.message || 'Login failed: Incorrect credentials.');
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler for form submission via Enter key
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{ minHeight: '100vh', backgroundColor: '#121212' }}
    >
      <StyledPaper elevation={3}>
        <HeaderBox>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 700,
              color: '#3f51b5',
            }}
          >
            Teacher Login
          </Typography>
          <Typography variant="body2" sx={{ color: '#ccc', marginTop: 1 }}>
            Welcome back! Please enter your credentials to continue.
          </Typography>
        </HeaderBox>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2, backgroundColor: '#f44336', color: '#fff' }}>
            {error}
          </Alert>
        )}

        <InputField
          label="Username"
          variant="outlined"
          fullWidth
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="username"
          aria-label="username"
        />

        <InputField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={handleKeyPress}
          autoComplete="current-password"
          aria-label="password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Tooltip title={showPassword ? 'Hide Password' : 'Show Password'}>
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={togglePasswordVisibility}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </Tooltip>
              </InputAdornment>
            ),
          }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              color="primary"
              sx={{ color: '#ccc', '&.Mui-checked': { color: '#3f51b5' } }}
            />
          }
          label="Remember Me"
          sx={{ color: '#ccc' }}
        />

        <StyledButton
          variant="contained"
          fullWidth
          onClick={handleLogin}
          disabled={isSubmitting}
          aria-label="login"
        >
          {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </StyledButton>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" sx={{ color: '#ccc' }}>
            Forgot your password?{' '}
            <Button
              variant="text"
              color="primary"
              size="small"
              onClick={() => navigate('/forgot-password')}
              sx={{ textTransform: 'none', color: '#3f51b5' }}
              aria-label="forgot password"
            >
              Reset Password
            </Button>
          </Typography>
        </Box>
      </StyledPaper>
    </Grid>
  );
};

export default Login;
