import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Box,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from '@mui/material';
import { fetchStudentQuizResults } from '../services/fakeApi';

const QuizResultPage = () => {
  const { studentId, quizId } = useParams();
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadQuizResult = async () => {
      console.log(`Fetching results for Quiz ID: ${quizId} and Student ID: ${studentId}`);
      try {
        const result = await fetchStudentQuizResults(quizId, studentId);
        console.log('Fetched Quiz Result:', result);
        if (result) {
          setQuizResult(result);
        } else {
          setError('No results found for this quiz.');
        }
      } catch (error) {
        console.error('Error fetching quiz results:', error);
        setError('Error fetching quiz results');
      } finally {
        setLoading(false);
      }
    };

    loadQuizResult();
  }, [quizId, studentId]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!quizResult) {
    return <Typography color="error">No quiz result data available.</Typography>;
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '8px',
        backgroundColor: '#f4f4f9',
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="#2a2a3b" fontWeight="bold">
          {quizResult.quiz_name}
        </Typography>
        <Typography
          variant="h5"
          color="#2a2a3b"
          fontWeight="bold"
          sx={{
            padding: '10px 20px',
            backgroundColor: '#e0e0e0',
            borderRadius: '8px',
            boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.2)',
          }}
        >
          Score: {quizResult.score}%
        </Typography>
      </Box>
      <Typography variant="body1" color="#2a2a3b" mb={3}>
        {quizResult.description}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {quizResult.questionResults.map((result, index) => (
              <React.Fragment key={result.questionId}>
                <TableRow sx={{ backgroundColor: '#2a2a3b' }}>
                  <TableCell
                    colSpan={2}
                    sx={{
                      color: '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      padding: '16px',
                    }}
                  >
                    Question {index + 1}: {result.questionText}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2} sx={{ padding: '16px' }}>
                    {result.questionType === 'multipleChoice' ? (
                      <RadioGroup value={result.studentAnswer || ''} disabled>
                        {result.options.map((option) => (
                          <FormControlLabel
                            key={option.id}
                            value={option.id}
                            control={<Radio />}
                            label={`${option.answer_text} ${
                              option.id === result.correctAnswer ? '(Correct)' : ''
                            }`}
                            sx={{
                              color:
                                option.id === result.studentAnswer
                                  ? result.isCorrect
                                    ? '#4caf50'
                                    : '#f44336'
                                  : '#000',
                            }}
                          />
                        ))}
                      </RadioGroup>
                    ) : (
                      <TextField
                        fullWidth
                        variant="outlined"
                        value={result.studentAnswer || 'No Answer'}
                        disabled
                        error={!result.isCorrect}
                        helperText={
                          !result.isCorrect ? `Correct answer: ${result.correctAnswer}` : ''
                        }
                      />
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Divider />
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default QuizResultPage;
