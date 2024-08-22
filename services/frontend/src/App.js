// src/App.js
import * as React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import TeacherDashboardContent from './components/TeacherDashboardContent';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/teacher/dashboard" element={<TeacherDashboardContent />} />
                {/* Other routes can go here */}
            </Routes>
        </Router>
    );
};

export default App;
