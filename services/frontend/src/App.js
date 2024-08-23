// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import DashboardPage from './pages/DashboardPage';
import CoursePage from './pages/CoursePage';
import CourseManagement from './components/CourseManagement/CourseManagement';
import { CssBaseline } from '@mui/material';
import CourseRoutes from './pages/Routes'; // Import CourseRoutes

const App = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    const storedTeacherId = localStorage.getItem('teacher_id');
    if (storedTeacherId) {
      setTeacherId(Number(storedTeacherId));
    }

    const storedCourseId = localStorage.getItem('selected_course_id');
    if (storedCourseId) {
      setSelectedCourseId(Number(storedCourseId));
    }
  }, []);

  const handleLogin = (id) => {
    setTeacherId(id);
    localStorage.setItem('teacher_id', id);
  };

  const handleLogout = () => {
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('selected_course_id');
    setTeacherId(null);
    setSelectedCourseId(null);
  };

  const handleCourseSelect = (courseId) => {
    setSelectedCourseId(courseId);
    localStorage.setItem('selected_course_id', courseId);
  };

  return (
    <Router>
      <CssBaseline />
      <Routes>
        {teacherId ? (
          <>
            <Route path="/dashboard" element={<DashboardPage onLogout={handleLogout} teacherId={teacherId} />} />
            <Route path="/course-management" element={<CourseManagement onCourseSelect={handleCourseSelect} teacherId={teacherId} />} />
            <Route
              path="/course/:courseId/*"
              element={selectedCourseId ? <CoursePage /> : <Navigate to="/course-management" replace />}
            />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
