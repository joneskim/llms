// src/AdminDashboard.js
import * as React from 'react';
import { AppBar, Toolbar, Typography, Button, Drawer, List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
import { Dashboard as DashboardIcon, School, Assignment, Quiz, People } from '@mui/icons-material';
import { Outlet, Link } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" className="appbar">
                <Toolbar>
                    <Typography variant="h6" noWrap className="title">
                        Admin Dashboard
                    </Typography>
                    <Button color="inherit" className="logout-button">Logout</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className="drawer"
                classes={{ paper: 'drawer-paper' }}
            >
                <List>
                    <ListItem button component={Link} to="/admin">
                        <ListItemIcon><DashboardIcon /></ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/courses">
                        <ListItemIcon><School /></ListItemIcon>
                        <ListItemText primary="Courses" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/assignments">
                        <ListItemIcon><Assignment /></ListItemIcon>
                        <ListItemText primary="Assignments" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/quizzes">
                        <ListItemIcon><Quiz /></ListItemIcon>
                        <ListItemText primary="Quizzes" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin/users">
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Users" />
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" className="content">
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    );
};

export default AdminDashboard;
