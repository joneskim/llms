// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Course from './pages/Course';
import Assignments from './pages/Assignments';
import Quizzes from './pages/Quizzes';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/course/:id" element={<Course />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
