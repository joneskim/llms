// src/components/StyledComponents.js

import { styled } from '@mui/material/styles';
import { Box, Typography, TextField, IconButton, Button, Divider, Paper } from '@mui/material';

// Container with consistent padding and background
export const StyledContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.background.paper,
  minHeight: '100vh',
}));

// Header with flex alignment
export const Header = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  alignItems: 'center',
}));

// Title with consistent typography
export const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
  fontWeight: theme.typography.fontWeightBold,
  color: theme.palette.text.primary,
}));

// Search field with consistent styling (if needed in future)
export const SearchField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
}));

// Styled Back Button
export const BackButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.text.primary,
}));

// Error Box for displaying alerts
export const ErrorBox = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '60vh',
  backgroundColor: '#F9FAFB',
});

// Additional Styled Components specific to QuizCreatePage

// Paper component for each question
export const QuestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  backgroundColor: '#f7f7f7',
  borderRadius: theme.shape.borderRadius,
  border: '1px solid #ddd',
}));

// Styled Button with theme colors
export const FormButton = styled(Button)(({ theme }) => ({
    padding: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    textTransform: 'none',
  }));

// Styled Divider
export const DividerStyled = styled(Divider)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));
