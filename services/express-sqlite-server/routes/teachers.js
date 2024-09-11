//teachers.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all teachers
router.get('/', async (req, res) => {
  try {
    const teachers = await prisma.teacher.findMany();
    res.json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific teacher by ID
router.get('/:teacherId', async (req, res) => {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: req.params.teacherId }
    });
    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new teacher
router.post('/', async (req, res) => {
  try {
    const teacher = await prisma.teacher.create({
      data: req.body,
    });
    res.status(201).json(teacher);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a teacher by ID
router.put('/:teacherId', async (req, res) => {
  try {
    const teacher = await prisma.teacher.update({
      where: { id: req.params.teacherId },
      data: req.body,
    });
    res.json(teacher);
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Teacher not found' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

// Delete a teacher by ID
router.delete('/:teacherId', async (req, res) => {
  try {
    await prisma.teacher.delete({
      where: { id: req.params.teacherId }
    });
    res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'Teacher not found' });
    } else {
      res.status(400).json({ error: error.message });
    }
  }
});

module.exports = router;
