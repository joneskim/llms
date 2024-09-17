import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';

const QuizzesTable = ({ quizzes, onTakeQuiz, onEditQuiz }) => {
  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
            <TableCell
              sx={{
                color: '#ffffff',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderBottom: 'none',
                padding: '16px',
              }}
            >
              Quiz Title
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
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <TableRow key={quiz.id} hover>
                <TableCell
                  component="th"
                  scope="row"
                  sx={{ cursor: 'pointer', color: '#2a2a3b' }}
                  onClick={() => onTakeQuiz(quiz)}
                  aria-label={`Take Quiz: ${quiz.quiz_name}`}
                >
                  {quiz.quiz_name}
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit Quiz" placement="top">
                    <IconButton
                      onClick={() => onEditQuiz(quiz)}
                      sx={{ color: '#1abc9c' }}
                      aria-label={`Edit Quiz: ${quiz.quiz_name}`}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center">
                <Typography variant="body1" color="textSecondary">
                  No quizzes found.
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default QuizzesTable;
