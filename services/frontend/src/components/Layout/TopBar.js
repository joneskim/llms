// src/components/Layout/TopBar.js

import React, { useState, useEffect } from 'react';
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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'; // Imported Correctly
import SearchIcon from '@mui/icons-material/Search';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import { useNavigate } from 'react-router-dom';
import { deepPurple } from '@mui/material/colors';
import Cookies from 'js-cookie';

// Import your API functions
import {
  fetchNotificationsByTeacherId,
  // ... other API functions if needed
} from '../../services/fakeApi'; // Adjust the import path as necessary

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
    minWidth: 300,
    boxShadow: theme.shadows[5],
  },
  '& .MuiMenuItem-root': {
    '&:hover': {
      backgroundColor: alpha('#212529', 0.05), // Very Light Gray hover
    },
  },
}));

const NotificationMenu = styled(Box)(({ theme }) => ({
  maxHeight: '400px',
  overflowY: 'auto',
}));

const TopBar = ({ toggleSidebar }) => {
  const [anchorEl, setAnchorEl] = useState(null); // User Menu Anchor
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null); // Notifications Menu Anchor
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch notifications on component mount
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const teacherId = Cookies.get('teacher_id'); // Assuming teacher_id is stored in cookies
        if (!teacherId) {
          setError('Teacher ID not found.');
          return;
        }

        const data = await fetchNotificationsByTeacherId(teacherId);
        setNotifications(data);
        const count = data.filter((notif) => !notif.isRead).length;
        setUnreadCount(count);
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setError('Failed to load notifications.');
      } finally {
        setLoadingNotifications(false);
      }
    };

    loadNotifications();
  }, []);

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

  // Handler for search functionality
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

  // Handler to open notifications menu
  const handleNotificationsOpen = (event) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  // Handler to close notifications menu
  const handleNotificationsClose = () => {
    setNotificationAnchorEl(null);
  };

  // Handler to navigate to notifications page
  const handleNavigateNotifications = () => {
    navigate('/notifications');
    handleNotificationsClose();
  };

  // Handler to mark a notification as read
  const handleMarkAsRead = async (id) => {
    try {
      // Implement API call to mark as read if needed
      // Example: await api.markNotificationAsRead(id);

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Optionally, display an error message to the user
    }
  };

  // Handler to mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      // Implement API call to mark all as read if needed
      // Example: await api.markAllNotificationsAsRead();

      // Update local state
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Optionally, display an error message to the user
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
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
            aria-label="notifications"
          >
            <Badge badgeContent={unreadCount} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* User Avatar */}
        <Tooltip title="Account settings">
          <IconButton
            color="inherit"
            onClick={handleMenuOpen}
            aria-label="account"
            sx={{ ml: 2 }}
          >
            <Avatar
              alt="Profile Picture"
              src="/profile-pic.jpg" // Replace with actual profile picture source
              sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }}
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
          <Divider />
          <MenuItem onClick={handleLogout}>
            <Box display="flex" alignItems="center">
              <LogoutIcon fontSize="small" sx={{ mr: 1, color: '#212529' }} />
              Logout
            </Box>
          </MenuItem>
        </StyledMenu>

        {/* Notifications Menu */}
        <Menu
          anchorEl={notificationAnchorEl}
          open={Boolean(notificationAnchorEl)}
          onClose={handleNotificationsClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
          >
            <Typography variant="h6">Notifications</Typography>
            {unreadCount > 0 && (
              <Button
                size="small"
                onClick={handleMarkAllAsRead}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                }}
              >
                Mark all as read
              </Button>
            )}
          </Box>
          <Divider />
          <NotificationMenu>
            {loadingNotifications ? (
              <Box
                p={2}
                display="flex"
                justifyContent="center"
                alignItems="center"
              >
                <CircularProgress size={24} />
              </Box>
            ) : error ? (
              <Box p={2}>
                <Typography variant="body2" color="error">
                  {error}
                </Typography>
              </Box>
            ) : notifications.length > 0 ? (
              notifications.map((notification) => (
                <MenuItem
                  key={notification.id}
                  onClick={() => {
                    // Navigate to a detailed view if needed
                    // For now, just mark as read and navigate
                    handleMarkAsRead(notification.id);
                    navigate('/notifications');
                    handleNotificationsClose();
                  }}
                  sx={{
                    backgroundColor: notification.isRead
                      ? 'inherit'
                      : alpha(theme.palette.primary.main, 0.1),
                  }}
                >
                  <ListItemIcon>
                    <Badge
                      variant="dot"
                      color="secondary"
                      invisible={notification.isRead}
                    >
                      <NotificationsActiveIcon color="action" />
                    </Badge>
                  </ListItemIcon>
                  <ListItemText
                    primary={notification.message}
                    secondary={new Date(notification.date).toLocaleString()}
                  />
                  {!notification.isRead && (
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      aria-label="mark as read"
                    >
                      <MarkEmailReadIcon fontSize="small" />
                    </IconButton>
                  )}
                </MenuItem>
              ))
            ) : (
              <Box p={2}>
                <Typography variant="body2">No notifications.</Typography>
              </Box>
            )}
          </NotificationMenu>
          {notifications.length > 0 && (
            <Box p={2} textAlign="center">
              <Button
                variant="text"
                onClick={handleNavigateNotifications}
                sx={{
                  textTransform: 'none',
                  fontWeight: 'bold',
                  color: theme.palette.primary.main,
                }}
              >
                View All Notifications
              </Button>
            </Box>
          )}
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default TopBar;
