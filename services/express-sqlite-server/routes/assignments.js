const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all assignments
router.get('/', async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany();
    res.json(assignments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific assignment by ID
router.get('/:assignmentId', async (req, res) => {
  try {
    const assignment = await prisma.assignment.findUnique({
      where: { id: req.params.assignmentId },
    });
    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all assignments for a specific module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const assignments = await prisma.assignment.findMany({
      where: { moduleId: req.params.moduleId },
    });
    res.json(assignments);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new assignment
router.post('/', async (req, res) => {
  try {
    const assignment = await prisma.assignment.create({
      data: req.body,
    });
    res.status(201).json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update an assignment by ID
router.put('/:assignmentId', async (req, res) => {
  try {
    const assignment = await prisma.assignment.update({
      where: { id: req.params.assignmentId },
      data: req.body,
    });
    res.json(assignment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete an assignment by ID
router.delete('/:assignmentId', async (req, res) => {
  try {
    const deleted = await prisma.assignment.delete({
      where: { id: req.params.assignmentId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
