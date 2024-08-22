// src/Dashboard.js
import * as React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { useDataProvider } from 'react-admin';

const Dashboard = () => {
    const dataProvider = useDataProvider();
    const [stats, setStats] = React.useState({
        courses: 0,
        assignments: 0,
        quizzes: 0,
        users: 0,
    });

    React.useEffect(() => {
        // Fetch data from your API and update stats
        dataProvider.getList('courses', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' } })
            .then(response => setStats(prevStats => ({ ...prevStats, courses: response.total })));
        dataProvider.getList('assignments', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' } })
            .then(response => setStats(prevStats => ({ ...prevStats, assignments: response.total })));
        dataProvider.getList('quizzes', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' } })
            .then(response => setStats(prevStats => ({ ...prevStats, quizzes: response.total })));
        dataProvider.getList('users', { pagination: { page: 1, perPage: 10 }, sort: { field: 'id', order: 'ASC' } })
            .then(response => setStats(prevStats => ({ ...prevStats, users: response.total })));
    }, [dataProvider]);

    return (
        <div>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="h2">
                        Welcome to the LMS Dashboard
                    </Typography>
                    <Typography color="textSecondary">
                        Manage your courses, assignments, and more.
                    </Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">Courses: {stats.courses}</Typography>
                    <Typography variant="h6">Assignments: {stats.assignments}</Typography>
                    <Typography variant="h6">Quizzes: {stats.quizzes}</Typography>
                    <Typography variant="h6">Users: {stats.users}</Typography>
                </CardContent>
            </Card>
        </div>
    );
};

export default Dashboard;
