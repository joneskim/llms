// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3498DB', // Sky Blue
    },
    secondary: {
      main: '#2ECC71', // Emerald Green
    },
    error: {
      main: '#E67E22', // Sunset Orange
    },
    background: {
      default: '#FFFFFF', // Pure White
      paper: '#FFFFFF', // Pure White for Paper components
    },
    text: {
      primary: '#212529', // Dark Gray
      secondary: '#6C757D', // Medium Gray
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // Pure White
          color: '#212529', // Dark Gray for text/icons
          boxShadow: 'none',
          borderBottom: '1px solid #DEE2E6', // Very Light Gray border
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF', // Pure White
          color: '#212529', // Dark Gray
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#DEE2E6', // Very Light Gray
          color: '#212529', // Dark Gray
          fontWeight: 'bold',
        },
        body: {
          color: '#212529', // Dark Gray
        },
      },
    },
  },
});

export default theme;
