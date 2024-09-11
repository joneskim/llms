import React from 'react';
import mammoth from 'mammoth';
import { Button, Grid, Typography } from '@mui/material';

const FileUploadComponent = ({ setQuestions }) => {
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];

    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      processWordFile(file);
    } else {
      alert('Unsupported file type. Please upload a DOCX file.');
    }
  };

  const processWordFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      const result = await mammoth.extractRawText({ arrayBuffer });
      const extractedQuestions = parseQuestions(result.value);
      setQuestions(extractedQuestions);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseQuestions = (text) => {
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const questions = [];
    let currentQuestion = null;
  
    lines.forEach(line => {
      const trimmedLine = line.trim();
  
      if (/^\d+\./.test(trimmedLine)) {  // Detect question number (e.g., 1.)
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          text: trimmedLine.replace(/^\d+\.\s*/, '').trim(), // Extract the question text after the number
          options: ['', '', '', ''],
          correctIndex: 0,
          type: 'multipleChoice',
        };
      } else if (/^[a-dA-D]\./.test(trimmedLine)) {  // Detect multiple choice options (e.g., a.)
        const optionIndex = trimmedLine.charCodeAt(0) - 97; // Get index for options array (0 = a, 1 = b, ...)
        if (optionIndex >= 0 && optionIndex < 4) {
          currentQuestion.options[optionIndex] = trimmedLine.slice(2).trim(); // Store the option text
        }
      } else if (/^Answer:\s*[a-dA-D]/i.test(trimmedLine)) {  // Detect correct answer (e.g., Answer: c)
        currentQuestion.correctIndex = trimmedLine.slice(-1).toLowerCase().charCodeAt(0) - 97; // Store the correct option index
      } else if (currentQuestion && currentQuestion.text) {
        // This case handles when options and the answer are being concatenated with the question.
        // We can add an extra check here to ensure that those lines are not added as part of the question.
        currentQuestion.text += ` ${trimmedLine.split(/(?:[a-dA-D]\.|Answer:\s*[a-dA-D])/).join('').trim()}`;
      }
    });
  
    // Push the last question to the array
    if (currentQuestion) {
      questions.push(currentQuestion);
    }   

    console.log(questions);
  
    return questions;
  };

  
  
  return (
    <Grid container spacing={2} sx={{ marginBottom: '1.5rem' }}>
      <Grid item xs={12}>
        <Typography variant="h6">Upload a Word Document to Generate Questions</Typography>
        <Button variant="contained" component="label" sx={{ marginTop: '1rem' }}>
          Upload File
          <input type="file" hidden onChange={handleFileUpload} />
        </Button>
      </Grid>
    </Grid>
  );
};

export default FileUploadComponent;
