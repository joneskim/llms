//tasks.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
    try {
      const { taskName, taskType, dueDate } = req.body;
      
      // Validate request body
      if (!taskName || !taskType) {
        return res.status(400).json({ error: 'Task name and type are required.' });
      }
  
      const task = await prisma.task.create({
        data: {
          taskName,
          taskType,
          dueDate: dueDate ? new Date(dueDate) : null,
        },
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
// Get all tasks for a specific course
router.get('/course/:courseId', async (req, res) => {
    try {
      const courseId = req.params.courseId;
  
      // Fetch tasks based on courseId
      const tasks = await prisma.task.findMany({
        where: {
          module: {
            courseId: courseId
          }
        }
      });
  
      if (tasks.length === 0) {
        return res.status(404).json({ error: 'No tasks found for this course' });
      }
  
      res.json(tasks);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  

module.exports = router;
