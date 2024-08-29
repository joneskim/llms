import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const TopBar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // Clear any stored authentication data
    localStorage.removeItem('teacher_id');
    localStorage.removeItem('selected_course_id');
    // Redirect to the login page
    navigate('/login');
    handleMenuClose(); // Close the menu after logout
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: '#1e1e2f',
        zIndex: 1201,
        boxShadow: 'none',
        borderBottom: '1px solid #333', // Subtle border at the bottom for a sleek look
      }}
    >
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          OASIS
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="secondary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Avatar
              alt="Profile Picture"
              src="/profile-pic.jpg" // Replace with actual profile picture source
              sx={{ width: 30, height: 30 }}
            />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem> {/* Updated to handle logout */}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
