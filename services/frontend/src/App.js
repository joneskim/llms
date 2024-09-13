import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login/Login';
import CoursePage from './pages/CoursePage';
import CourseManagement from './components/CourseManagement/CourseManagement';
import OverviewPage from './pages/OverviewPage';
import ModulesPage from './pages/ModulesPage';
import QuizzesPage from './pages/QuizzesPage';
import TasksPage from './pages/TasksPage';
import StudentsPage from './pages/StudentsPage';
import ModulePage from './pages/ModulePage';
import QuizCreatePage from './pages/QuizCreatePage';
import TakeQuizPage from './pages/TakeQuizPage';
import StudentQuizAccessPage from './pages/StudentQuizAccessPage';
import StudentQuizzesPage from './pages/StudentQuizzesPage';
import { CssBaseline } from '@mui/material';
import TopBar from './components/Layout/TopBar';
import TypingTest from './pages/TypingAssignment';
import StudentTaskAccessPage from './pages/StudentTasksPage';
import Cookies from 'js-cookie';

const App = () => {
  const [teacherId, setTeacherId] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  useEffect(() => {
    // Retrieve the teacherId from cookies
    const storedTeacherId = Cookies.get('teacher_id');
    console.log('storedTeacherId:', storedTeacherId);
    if (storedTeacherId) {
      setTeacherId(storedTeacherId); // No need to convert since it's a string
    }

    const storedCourseId = localStorage.getItem('selected_course_id');
    if (storedCourseId) {
      setSelectedCourseId(storedCourseId); // Assuming course ID is also a string
    }
  }, []);

  const handleLogin = (id) => {
    setTeacherId(id);
    Cookies.set('teacher_id', id); // Store teacher ID in cookies
  };

  console.log('teacherId:', teacherId);

  const handleLogout = () => {
    Cookies.remove('teacher_id');
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
        {/* Routes for teachers when logged in */}
        {teacherId ? (
          <>
            <Route
              path="/course-management"
              element={<CourseManagement onCourseSelect={handleCourseSelect} teacherId={teacherId} />}
            />
            <Route path="/course/:courseId" element={<CoursePage />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="modules" element={<ModulesPage courseId={selectedCourseId} />} />
              <Route path="quizzes" element={<QuizzesPage />} />
              <Route path="assignments" element={<TasksPage />} />
              <Route path="students" element={<StudentsPage />} />
              <Route path="modules/:moduleId" element={<ModulePage />} />
              <Route path="modules/:moduleId/create-quiz" element={<QuizCreatePage />} />
              <Route path="modules/:moduleId/edit-quiz/:quizId" element={<QuizCreatePage />} />
              <Route path="modules/:moduleId/take-quiz/:quizId" element={<TakeQuizPage />} />
              <Route path="students/:studentId/quizzes" element={<StudentQuizzesPage />} />
              <Route
                path="students/:studentId/quizzes/:quizId/results"
                element={<TakeQuizPage viewMode />}  // Use TakeQuizPage for viewing results
              />
              <Route path="*" element={<Navigate to="overview" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/course-management" replace />} />
          </>
        ) : (
          // Routes accessible without login, for students taking quizzes
          <>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/student-quiz-access" element={<StudentTaskAccessPage />} /> {/* Student access route */}
            <Route path="/take-quiz/:quizId" element={<TakeQuizPage />} /> {/* Direct quiz-taking route */}
            <Route
              path="/students/:studentId/courses/:courseId/quizzes/:quizId/results"
              element={<TakeQuizPage viewMode />}  // Use TakeQuizPage for viewing results
            />
            <Route path="*" element={<Navigate to="/student-quiz-access" replace />} /> {/* Default student route */}
            <Route path="/typing-test" element={<TypingTest />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default App;
