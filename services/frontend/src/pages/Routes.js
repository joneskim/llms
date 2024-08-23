// src/pages/CourseRoutes.js
import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';
import QuizzesPage from './QuizzesPage';
import AssignmentsPage from './AssignmentsPage';
import StudentsPage from './StudentsPage';
import ModulesPage from './ModulesPage';

const CourseRoutes = () => {
  // Extract courseId from the URL
  const { courseId } = useParams();

  return (
    <Routes>
      <Route path="modules" element={<ModulesPage courseId={courseId} />} />
      <Route path="quizzes" element={<QuizzesPage courseId={courseId} />} />
      <Route path="assignments" element={<AssignmentsPage courseId={courseId} />} />
      <Route path="students" element={<StudentsPage courseId={courseId} />} />
    </Routes>
  );
};

export default CourseRoutes;
