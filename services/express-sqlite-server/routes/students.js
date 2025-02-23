//students.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific student by ID
router.get('/:studentId', async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: req.params.studentId },
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const generateUniqueId = () => {
  return Math.random().toString(36).substring(2, 8); // Generates a random 6-character alphanumeric string
};

// Create a new student
router.post('/', async (req, res) => {
  const { name, courseId } = req.body;

  // Log received data
  console.log('Received data:', req.body);

  // Check if the necessary data is provided
  if (!name || !courseId) {
    console.log('Missing name or courseId:', { name, courseId });
    return res.status(400).json({ error: "Name and courseId are required." });
  }

  try {
    const student = await prisma.student.create({
      data: {
        uniqueId: generateUniqueId(),  // Backend generates uniqueId
        name,
        courses: {
          connect: { id: courseId },  // Connect to course by courseId
        },
      },
    });
    // Log the created student for debugging
    console.log('Created student:', student);

    // Respond with the newly created student
    res.status(201).json(student);
  } catch (error) {
    console.error('Error while creating student:', error);
    res.status(400).json({ error: error.message });
  }
});





// Update a student by ID
router.put('/:studentId', async (req, res) => {
  try {
    const student = await prisma.student.update({
      where: { id: req.params.studentId },
      data: req.body,
    });
    res.json(student);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a student by ID
router.delete('/:studentId', async (req, res) => {
  try {
    await prisma.student.delete({
      where: { id: req.params.studentId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific student by uniqueId
router.get('/uniqueId/:uniqueId', async (req, res) => {
    try {
      const student = await prisma.student.findUnique({
        where: { uniqueId: req.params.uniqueId },
      });
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
      res.json(student);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/course/:courseId', async (req, res) => {
    try {
      const courseId = req.params.courseId;
  
      // Fetch the course along with its students
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        include: { students: true },
      });
  
      if (!course || course.students.length === 0) {
        return res.status(404).json({ error: 'No students found for this course' });
      }
  
      res.json(course.students);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

  router.get('/:studentId/notifications/', async (req, res) => {
    const { studentId } = req.params;
    try {
      const notifications = await prisma.notification.findMany({
        where: { studentId },
        orderBy: { date: 'desc' },
      });
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  });

  // Assuming Express.js backend


router.patch('/notifications/:notificationId/read', async (req, res) => {
  const { notificationId } = req.params;
  try {
    console.log(notificationId);
    await Notification.findByIdAndUpdate(notificationId, { read: true });

    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
});

  

module.exports = router;
