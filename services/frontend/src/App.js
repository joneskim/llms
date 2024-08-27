import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import CoursePage from './pages/CoursePage';
import CourseManagement from './components/CourseManagement/CourseManagement';
import OverviewPage from './pages/OverviewPage';
import ModulesPage from './pages/ModulesPage';
import QuizzesPage from './pages/QuizzesPage';
import AssignmentsPage from './pages/AssignmentsPage';
import StudentsPage from './pages/StudentsPage';
import { CssBaseline } from '@mui/material';
import TopBar from './components/Layout/TopBar';

import ModulePage from './pages/ModulePage';
import QuizCreatePage from './pages/QuizCreatePage';

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
      {teacherId && <TopBar onLogout={handleLogout} />} {/* Show TopBar only when logged in */}
      <Routes>
        {teacherId ? (
          <>
            {/* Route to CourseManagement */}
            <Route
              path="/course-management"
              element={<CourseManagement onCourseSelect={handleCourseSelect} teacherId={teacherId} />}
            />
            {/* Route to CoursePage with nested routes */}
            <Route path="/course/:courseId" element={<CoursePage />}>
              {/* Redirect to Overview by default */}
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              {/* Pass courseId as a prop to ModulesPage */}
              <Route path="modules" element={<ModulesPage courseId={selectedCourseId} />} />
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="assignments" element={<AssignmentsPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="/course/:courseId/modules" element={<ModulesPage />} />
              <Route path="/course/:courseId/modules/:moduleId" element={<ModulePage />} />
              <Route path="/course/:courseId/modules/:moduleId/create-quiz" element={<QuizCreatePage />} />

              <Route path="*" element={<Navigate to="overview" replace />} /> {/* Catch-all to overview */}
            </Route>
            {/* Redirect any unknown paths to CourseManagement */}
            <Route path="*" element={<Navigate to="/course-management" replace />} />
          </>
        ) : (
          <>
            {/* Route to Login */}
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            {/* Redirect any unknown paths to Login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
