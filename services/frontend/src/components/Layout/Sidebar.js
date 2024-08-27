import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Paper, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizIcon from '@mui/icons-material/Quiz';
import PeopleIcon from '@mui/icons-material/People';
import GradeIcon from '@mui/icons-material/Grade';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: isOpen ? '250px' : '70px', // Adjust width based on isOpen state
        height: '100vh',
        position: 'fixed',
        top: '50px',
        left: 0,
        zIndex: 1200,
        backgroundColor: '#1e1e2f',
        color: '#fff',
        transition: 'width 0.3s',
        overflow: 'hidden',
        borderRadius: 0,
      }}
    >

      <List component="nav" sx={{ marginTop: '20px' }}>
        <ListItem button component={Link} to="overview" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <DashboardIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Overview" />}
        </ListItem>
        <Divider sx={{ bgcolor: '#333' }} />

        <ListItem button component={Link} to="modules" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <AssignmentIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Modules" />}
        </ListItem>
        <ListItem button component={Link} to="quizzes" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <QuizIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Quizzes" />}
        </ListItem>
        <ListItem button component={Link} to="assignments" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <AssignmentIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Assignments" />}
        </ListItem>
        <ListItem button component={Link} to="students" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <PeopleIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Students" />}
        </ListItem>
        <ListItem button component={Link} to="grades" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <GradeIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Grades" />}
        </ListItem>
        <Divider sx={{ bgcolor: '#333' }} />

        <ListItem button component={Link} to="settings" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <SettingsIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Settings" />}
        </ListItem>
        <ListItem button component={Link} to="profile" sx={{ '&:hover': { backgroundColor: '#2a2a3b' } }}>
          <ListItemIcon sx={{ color: '#bbb' }}>
            <PersonIcon />
          </ListItemIcon>
          {isOpen && <ListItemText primary="Profile" />}
        </ListItem>
      </List>
    </Paper>
  );
};

export default Sidebar;
