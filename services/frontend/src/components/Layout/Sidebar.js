import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Tooltip,
  Typography,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import MenuBookIcon from '@mui/icons-material/MenuBook'; // For Course Management

const navItems = [
  { text: 'Course Management', icon: <MenuBookIcon />, path: '/course-management' },
];

const SidebarContainer = styled(Box)(({ theme, isOpen }) => ({
  width: isOpen ? '250px' : '70px',
  height: '100vh',
  position: 'fixed',
  top: '64px', // Assuming TopBar height is 64px
  left: 0,
  backgroundColor: '#FFFFFF', // Pure White
  color: '#212529', // Dark Gray
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
  overflowX: 'hidden',
  zIndex: 1200,
}));

const LogoContainer = styled(Box)(({ theme, isOpen }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: isOpen ? 'flex-start' : 'center',
  padding: theme.spacing(2, 1),
  transition: theme.transitions.create(['justify-content'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
}));

const Logo = styled('img')(({ theme }) => ({
  height: '40px',
  width: '40px',
  borderRadius: '50%',
}));

const BrandName = styled(Typography)(({ theme, isOpen }) => ({
  marginLeft: theme.spacing(2),
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 'bold',
  color: '#212529', // Dark Gray
  whiteSpace: 'nowrap',
  opacity: isOpen ? 1 : 0,
  transition: theme.transitions.create('opacity', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.standard,
  }),
}));

const NavItem = styled(ListItemButton)(({ theme, active }) => ({
  color: active ? '#3498DB' : '#212529', // Sky Blue for active, Dark Gray otherwise
  backgroundColor: active ? '#E3F2FD' : 'transparent', // Light Blue background for active
  '&:hover': {
    backgroundColor: '#F8F9FA', // Hover Background
    color: '#3498DB', // Sky Blue
  },
}));

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    const storedCourseId = localStorage.getItem('selected_course_id');
    const storedCourseName = localStorage.getItem('selected_course_name');

    if (storedCourseId) {
      setSelectedCourseId(storedCourseId);
      setCourseName(storedCourseName || '');
    }
  }, []);

  const courseNavItems = selectedCourseId
    ? [
        { text: 'Overview', icon: <DashboardIcon />, path: `/course/${selectedCourseId}/overview` },
        { text: 'Modules', icon: <MenuBookIcon />, path: `/course/${selectedCourseId}/modules` },
        { text: 'Quizzes', icon: <QuizIcon />, path: `/course/${selectedCourseId}/quizzes` },
        { text: 'Assignments', icon: <AssignmentIcon />, path: `/course/${selectedCourseId}/assignments` },
        { text: 'Students', icon: <PeopleIcon />, path: `/course/${selectedCourseId}/students` },
      ]
    : [];

  return (
    <SidebarContainer isOpen={isOpen}>
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <Tooltip key={item.text} title={!isOpen ? item.text : ''} placement="right">
              <NavItem
                component={Link}
                to={item.path}
                active={isActive ? 1 : 0}
                sx={{ paddingY: isOpen ? 1.5 : 1 }}
                aria-label={item.text}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                {isOpen && (
                  <ListItemText
                    primary={item.text}
                    sx={{
                      marginLeft: -2,
                      fontFamily: 'Poppins, sans-serif',
                      fontWeight: isActive ? '600' : '400',
                    }}
                  />
                )}
              </NavItem>
            </Tooltip>
          );
        })}
      </List>

      {selectedCourseId && (
        <List>
          {courseNavItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Tooltip key={item.text} title={!isOpen ? item.text : ''} placement="right">
                <NavItem
                  component={Link}
                  to={item.path}
                  active={isActive ? 1 : 0}
                  sx={{ paddingY: isOpen ? 1.5 : 1 }}
                  aria-label={item.text}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                    {item.icon}
                  </ListItemIcon>
                  {isOpen && (
                    <ListItemText
                      primary={item.text}
                      sx={{
                        marginLeft: -2,
                        fontFamily: 'Poppins, sans-serif',
                        fontWeight: isActive ? '600' : '400',
                      }}
                    />
                  )}
                </NavItem>
              </Tooltip>
            );
          })}
        </List>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
