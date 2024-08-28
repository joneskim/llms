import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box, Badge, Avatar, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useState } from 'react';

const TopBar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        backgroundColor: '#1e1e2f', 
        zIndex: 1201, 
        boxShadow: 'none',
        borderBottom: '1px solid #333'  // Subtle border at the bottom for a sleek look
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
          <IconButton 
            color="inherit" 
            onClick={handleMenuOpen}  // Open the profile menu
          >
            <Avatar 
              alt="Profile Picture" 
              src="/profile-pic.jpg"  // Replace with actual profile picture source
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
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
