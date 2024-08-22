// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';


const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/course">Courses</Link>
        </li>
        <li>
          <Link to="/assignments">Assignments</Link>
        </li>
        <li>
          <Link to="/quizzes">Quizzes</Link>
        </li>
        <li>
          <Link to="/profile">Profile</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
