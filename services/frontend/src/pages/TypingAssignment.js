import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Box, Paper } from '@mui/material';
import { loremIpsum } from 'lorem-ipsum';

const generateLoremIpsum = () => loremIpsum({ count: 1, units: 'paragraphs' });

const TypingTest = () => {
  const [inputText, setInputText] = useState('');
  const [sampleText, setSampleText] = useState(generateLoremIpsum());
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

    const typedWordsArray = inputText.trim().split(/\s+/); // Array of words typed by the user
    const correctWords = typedWordsArray.filter((word, index) => word === sampleText.split(/\s+/)[index]).length;
    const wpm = Math.round(correctWords / timeTaken); // words per minute
    setWordsPerMinute(wpm);

    const correctChars = inputText.split('').filter((char, index) => char === sampleText[index]).length;
    const accuracy = Math.round((correctChars / inputText.length) * 100);
    setAccuracy(accuracy);

    setIsFinished(true);
  };

  const handleStart = () => {
    setInputText('');
    setIsFinished(false);
    setStartTime(null);
    setHasStarted(true);
    setTimeLeft(300); // Reset the timer to 5 minutes
    setSampleText(generateLoremIpsum()); // Generate a new Lorem Ipsum paragraph
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
      <Box
        sx={{
          padding: '2rem',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          width: '100%',
          maxWidth: '800px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography variant="h4" fontWeight="bold" color="#2c3e50" gutterBottom>
          Typing Speed Test
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ marginBottom: '1.5rem' }}>
          Type the text below as quickly and accurately as you can within 5 minutes:
        </Typography>
        <Box
          sx={{
            backgroundColor: '#ffffff',
            padding: '1.5rem',
            borderRadius: '8px',
            border: '1px solid #dfe6e9',
            marginBottom: '1.5rem',
            fontFamily: 'monospace',
            fontSize: '1.1rem',
            color: '#2d3436',
            textAlign: 'left',
          }}
        >
          {sampleText}
        </Box>

        {hasStarted && (
          <>
            <Typography variant="h6" color="#d63031" sx={{ marginBottom: '1.5rem' }}>
              Time Left: {formatTime(timeLeft)}
            </Typography>

            <TextField
              fullWidth
              multiline
              variant="outlined"
              rows={6}
              value={inputText}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              disabled={isFinished}
              placeholder="Start typing here..."
              inputRef={inputRef}
              sx={{
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                fontSize: '1rem',
                fontFamily: 'monospace',
              }}
            />
          </>
        )}

        {isFinished ? (
          <Box sx={{ marginTop: '2rem', textAlign: 'center' }}>
            <Typography variant="h5" fontWeight="bold" color="#2c3e50">
              Your Results:
            </Typography>
            <Typography variant="h6" color="#0984e3" sx={{ marginTop: '1rem' }}>
              Words per minute: {wordsPerMinute} WPM
            </Typography>
            <Typography variant="h6" color={accuracy >= 90 ? '#00b894' : '#d63031'} sx={{ marginTop: '0.5rem' }}>
              Accuracy: {accuracy}%
            </Typography>
            <Button
              variant="contained"
              onClick={handleReset}
              sx={{
                marginTop: '1.5rem',
                backgroundColor: '#2d3436',
                color: '#ffffff',
                padding: '10px 20px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#636e72',
                },
              }}
            >
              Try Again
            </Button>
          </Box>
        ) : (
          !hasStarted && (
            <Button
              variant="contained"
              onClick={handleStart}
              sx={{
                backgroundColor: '#00cec9',
                color: '#ffffff',
                padding: '10px 20px',
                fontSize: '1rem',
                '&:hover': {
                  backgroundColor: '#00b894',
                },
              }}
            >
              Start Test
            </Button>
          )
        )}
      </Box>
    </Container>
  );
};

export default TypingTest;
