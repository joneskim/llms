// src/components/AdminDashboardContent.js
import * as React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';

const AdminDashboardContent = () => {
    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            24 Courses
                        </Typography>
                        <Typography color="textSecondary">
                            Manage your courses here
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            50 Assignments
                        </Typography>
                        <Typography color="textSecondary">
                            View and grade assignments
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            10 Quizzes
                        </Typography>
                        <Typography color="textSecondary">
                            Create and manage quizzes
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card className="card">
                    <CardContent>
                        <Typography variant="h5" component="h2">
                            120 Users
                        </Typography>
                        <Typography color="textSecondary">
                            Manage user accounts
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
};

export default AdminDashboardContent;
