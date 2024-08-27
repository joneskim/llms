import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizCreatePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const module = location.state?.module;

  const [quizTitle, setQuizTitle] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctIndex: 0 }]);

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctIndex: 0 }]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = questions.map((q, i) => (i === index ? { ...q, text: value } : q));
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex
        ? {
            ...q,
            options: q.options.map((opt, idx) => (idx === optionIndex ? value : opt)),
          }
        : q
    );
    setQuestions(updatedQuestions);
  };

  const handleCorrectOptionChange = (questionIndex, value) => {
    const updatedQuestions = questions.map((q, i) =>
      i === questionIndex ? { ...q, correctIndex: value } : q
    );
    setQuestions(updatedQuestions);
  };

  const handleSubmit = () => {
    // Logic to save the quiz goes here
    alert(`Quiz "${quizTitle}" created for ${module.moduleName}`);
    navigate(`/modules`);
  };

  return (
    <div>
      <h2>Create Quiz for {module?.moduleName}</h2>

      <div>
        <label>Quiz Title:</label>
        <input
          type="text"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.target.value)}
        />
      </div>

      {questions.map((question, index) => (
        <div key={index} style={{ marginTop: '20px' }}>
          <label>Question {index + 1}:</label>
          <input
            type="text"
            value={question.text}
            onChange={(e) => handleQuestionChange(index, e.target.value)}
          />
          <div style={{ marginTop: '10px' }}>
            {question.options.map((option, optIndex) => (
              <div key={optIndex}>
                <label>Option {optIndex + 1}:</label>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, optIndex, e.target.value)}
                />
                <input
                  type="radio"
                  name={`correct-option-${index}`}
                  checked={question.correctIndex === optIndex}
                  onChange={() => handleCorrectOptionChange(index, optIndex)}
                />
                Correct
              </div>
            ))}
          </div>
        </div>
      ))}

      <button onClick={handleAddQuestion} style={{ marginTop: '20px' }}>
        Add Another Question
      </button>

      <button onClick={handleSubmit} style={{ marginTop: '20px' }}>
        Create Quiz
      </button>
    </div>
  );
};

export default QuizCreatePage;
