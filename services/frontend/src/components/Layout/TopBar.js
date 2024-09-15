// src/components/TopBar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Badge,
  Avatar,
  Menu,
  MenuItem,
  Tooltip,
  InputBase,
  styled,
  alpha,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import Cookies from 'js-cookie';

// Styled Components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#FFFFFF', // Pure White
  zIndex: theme.zIndex.drawer + 1,
  boxShadow: 'none',
  borderBottom: `1px solid ${alpha('#DEE2E6', 1)}`, // Very Light Gray border
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha('#212529', 0.05), // Very Light Gray
  '&:hover': {
    backgroundColor: alpha('#212529', 0.1),
  },
  marginRight: theme.spacing(2),
  marginLeft: theme.spacing(2),
  width: '100%',
  maxWidth: 400,
  [theme.breakpoints.down('sm')]: {
    display: 'none', // Hide search bar on small screens
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: '#212529', // Dark Gray
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // Vertical padding + font size from SearchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  '& .MuiPaper-root': {
    backgroundColor: '#FFFFFF', // Pure White
    color: '#212529', // Dark Gray
    borderRadius: theme.spacing(1),
    minWidth: 150,
    boxShadow: theme.shadows[5],
  },
  '& .MuiMenuItem-root': {
    '&:hover': {
      backgroundColor: alpha('#212529', 0.05), // Very Light Gray hover
    },
  },
}));

const TopBar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Handler to open user menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handler to close user menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handler for logout action
  const handleLogout = () => {
    // Clear stored authentication data from cookies
    Cookies.remove('session_token');
    Cookies.remove('teacher_id');
    Cookies.remove('selected_course_id'); // Remove other relevant cookies if any

    // Redirect to the login page
    navigate('/login');

    // Close the menu after logout
    handleMenuClose();
  };

  // Handler for navigating to profile
  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  // Handler for navigating to settings
  const handleSettings = () => {
    navigate('/settings');
    handleMenuClose();
  };

  // Handler for navigating to notifications
  const handleNotifications = () => {
    navigate('/notifications');
    handleMenuClose();
  };

  // Handler for search functionality (Placeholder)
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const query = e.target.value.trim();
      if (query) {
        // Implement search logic here
        console.log(`Searching for: ${query}`);
        // For example, navigate to a search results page
        navigate(`/search?query=${encodeURIComponent(query)}`);
      }
    }
  };

  return (
    <StyledAppBar position="fixed">
      <Toolbar>
        {/* Sidebar Toggle Button */}
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* App Title */}
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            display: { xs: 'none', sm: 'block' },
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            color: '#212529', // Dark Gray
          }}
        >
          OASIS
        </Typography>

        {/* Search Bar */}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onKeyPress={handleSearch}
          />
        </Search>

        {/* Spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Notification Icon */}
        <Tooltip title="Notifications">
          <IconButton color="inherit" onClick={handleNotifications} aria-label="notifications">
            <Badge badgeContent={4} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Avatar */}
        <Tooltip title="Account settings">
          <IconButton color="inherit" onClick={handleMenuOpen} aria-label="account">
            <Avatar
              alt="Profile Picture"
              src="/profile-pic.jpg" // Replace with actual profile picture source
              sx={{ bgcolor: '#9B59B6', width: 30, height: 30 }} // Vibrant Purple
            />
          </IconButton>
        </Tooltip>

        {/* User Menu */}
        <StyledMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleProfile}>
            <Box display="flex" alignItems="center">
              <Avatar
                alt="Profile"
                src="/profile-pic.jpg" // Replace with actual profile picture source
                sx={{ width: 24, height: 24, mr: 1, bgcolor: '#2ECC71' }} // Emerald Green
              />
              Profile
            </Box>
          </MenuItem>
          <MenuItem onClick={handleSettings}>
            <Box display="flex" alignItems="center">
              <SettingsIcon fontSize="small" sx={{ mr: 1, color: '#212529' }} />
              Settings
            </Box>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Box display="flex" alignItems="center">
              <LogoutIcon fontSize="small" sx={{ mr: 1, color: '#212529' }} />
              Logout
            </Box>
          </MenuItem>
        </StyledMenu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;
