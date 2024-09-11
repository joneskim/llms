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

// Create a new student
router.post('/', async (req, res) => {
  try {
    const student = await prisma.student.create({
      data: req.body,
    });
    res.status(201).json(student);
  } catch (error) {
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
  

module.exports = router;
