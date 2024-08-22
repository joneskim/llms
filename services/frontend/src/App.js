import * as React from 'react';
import { Admin, Resource } from 'react-admin';
import fakeDataProvider from 'ra-data-fakerest';
import Dashboard from './pages/Dashboard';
import { CourseList } from './components/CourseList';
import { AssignmentList } from './components/AssignmentList';
import { QuizList } from './components/QuizList';
import { UserList } from './components/UserList';

const data = {
    courses: [
        { id: 1, name: 'Physics 101' },
        { id: 2, name: 'Math 201' }
    ],
    assignments: [
        { id: 1, title: 'Homework 1', due_date: '2024-09-01' },
        { id: 2, title: 'Homework 2', due_date: '2024-09-10' }
    ],
    quizzes: [
        { id: 1, title: 'Quiz 1', created_at: '2024-08-15' },
        { id: 2, title: 'Quiz 2', created_at: '2024-08-20' }
    ],
    users: [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com' }
    ]
};

const dataProvider = fakeDataProvider(data);

const App = () => (
    <Admin dashboard={Dashboard} dataProvider={dataProvider}>
        <Resource name="courses" list={CourseList} />
        <Resource name="assignments" list={AssignmentList} />
        <Resource name="quizzes" list={QuizList} />
        <Resource name="users" list={UserList} />
    </Admin>
);

export default App;
