import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';

const sampleText = "The quick brown fox jumps over the lazy dog.";

const TypingTest = () => {
  const [inputText, setInputText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [accuracy, setAccuracy] = useState(0);
  const [wordsPerMinute, setWordsPerMinute] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputText === sampleText || timeLeft === 0) {
      endTest();
    }
  }, [inputText, timeLeft]);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
  };

  const endTest = () => {
    clearInterval(timerRef.current);
    const timeTaken = (300 - timeLeft) / 60; // time in minutes

    const typedWords = inputText.trim().split(/\s+/).length; // words typed by the user
    const wpm = Math.round(typedWords / timeTaken); // words per minute
    setWordsPerMinute(wpm);

    const correctChars = inputText.split('').filter((char, index) => char === sampleText[index]).length;
    const accuracy = Math.round((correctChars / sampleText.length) * 100);
    setAccuracy(accuracy);

    setIsFinished(true);
  };

  const handleStart = () => {
    setInputText('');
    setIsFinished(false);
    setStartTime(null);
    setHasStarted(true);
    setTimeLeft(300); // Reset the timer to 5 minutes
  };

  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(Date.now());
      startTimer();
    }
    setInputText(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isFinished) {
      endTest();
    }
  };

  const handleReset = () => {
    setInputText('');
    setStartTime(null);
    setIsFinished(false);
    setAccuracy(0);
    setWordsPerMinute(0);
    setTimeLeft(300); // Reset the timer
    clearInterval(timerRef.current);
    setHasStarted(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  useEffect(() => {
    if (hasStarted && inputRef.current) {
      inputRef.current.focus();
    }
  }, [hasStarted]);

  return (
    <Container maxWidth="md" sx={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={5}
        sx={{
          padding: '3rem',
          borderRadius: '16px',
          backgroundColor: '#f7f9fc',
          width: '100%',
          maxWidth: '700px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h3" fontWeight="bold" color="#34495e" gutterBottom>
          Typing Speed Test
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom sx={{ marginBottom: '2rem' }}>
          Type the following text as quickly and accurately as you can within 5 minutes:
        </Typography>
        <Typography variant="h5" color="#2c3e50" gutterBottom sx={{ marginBottom: '1.5rem' }}>
          "{sampleText}"
        </Typography>

        {hasStarted && (
          <>
            <Typography variant="h6" color="#e74c3c" sx={{ marginBottom: '1.5rem' }}>
              Time Left: {formatTime(timeLeft)}
            </Typography>

            <TextField
              fullWidth
              multiline
              variant="outlined"
              rows={4}
              value={inputText}
              onChange={handleChange}
              onKeyPress={handleKeyPress} // Add this to handle Enter key press
              disabled={isFinished}
              placeholder="Start typing here..."
              inputRef={inputRef}
              sx={{
                marginBottom: '2rem',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                fontSize: '1.2rem',
                fontFamily: 'monospace',
              }}
            />
          </>
        )}

        {isFinished ? (
          <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="#34495e">
              Your Results:
            </Typography>
            <Typography variant="h6" color="#27ae60" sx={{ marginTop: '1rem' }}>
              Words per minute: {wordsPerMinute} WPM
            </Typography>
            <Typography variant="h6" color={accuracy >= 90 ? '#27ae60' : '#e74c3c'} sx={{ marginTop: '0.5rem' }}>
              Accuracy: {accuracy}%
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              sx={{
                marginTop: '2rem',
                backgroundColor: '#34495e',
                padding: '10px 20px',
                fontSize: '1rem',
              }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          !hasStarted && (
            <Button
              variant="contained"
              color="primary"
              onClick={handleStart}
              sx={{
                backgroundColor: '#3498db',
                padding: '10px 20px',
                fontSize: '1rem',
              }}
            >
              Start Test
            </Button>
          )
        )}
      </Paper>
    </Container>
  );
};

export default TypingTest;
