const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Import cors
const tasksRoutes = require('./routes/tasks');
const assignmentsRoutes = require('./routes/assignments');
const quizzesRoutes = require('./routes/quizzes');
const studentsRoutes = require('./routes/students');
const modulesRoutes = require('./routes/modules');
const coursesRoutes = require('./routes/courses');
const teachersRoutes = require('./routes/teachers');
const authRoutes = require('./routes/auth');

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

app.use('/tasks', tasksRoutes);
app.use('/assignments', assignmentsRoutes);
app.use('/quizzes', quizzesRoutes);
app.use('/students', studentsRoutes);
app.use('/modules', modulesRoutes);
app.use('/courses', coursesRoutes);
app.use('/teachers', teachersRoutes);
app.use('/auth', authRoutes);

const prisma = new PrismaClient();
app.listen(8000, () => {
  console.log('Server is running on http://localhost:8000');
});
