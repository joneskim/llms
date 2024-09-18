//courses.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        modules: true,
        teacher: true,
        students: true,
      },
    });
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific course by ID
router.get('/:courseId', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.courseId },
      include: {
        modules: true,
        teacher: true,
        students: true,
      },
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get courses by teacher ID
router.get('/teacher/:teacherId', async (req, res) => {
    console.log("teacherId", req.params.teacherId);
  try {
    const courses = await prisma.course.findMany({
      where: { teacherId: req.params.teacherId },   
      include: {
        modules: true,
        teacher: true,
        students: true,
      },
    });
    console.log(courses);
    res.json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const course = await prisma.course.create({
      data: req.body,
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a course by ID
router.put('/:courseId', async (req, res) => {
  try {
    const course = await prisma.course.update({
      where: { id: req.params.courseId },
      data: req.body,
    });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a course by ID
router.delete('/:courseId', async (req, res) => {
  try {
    await prisma.course.delete({
      where: { id: req.params.courseId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all courses for a specific student
router.get('/student/:studentId', async (req, res) => {
    try {
      // Fetch the student along with their associated courses
      const student = await prisma.student.findUnique({
        where: { id: req.params.studentId },
        include: {
          courses: true, // Include courses directly
        },
      });
  
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      // Extract courses directly from the student data
      const courses = student.courses;
  
      if (courses.length === 0) {
        return res.status(404).json({ error: 'No courses found for this student' });
      }
  
      res.json(courses);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  router.get('/:courseId/results', async (req, res) => {
    console.log("courseId", req.params.courseId);
    try {
      const { courseId } = req.params;
  
      // Fetch all quizzes related to the course
      const quizzes = await prisma.quiz.findMany({
        where: {
          module: {
            courseId: courseId,
          },
        },
        include: {
          results: true,  // Only include the results to calculate the total score
        }
      });
  
      if (quizzes.length === 0) {
        return res.status(404).json({ error: 'No quizzes found for this course' });
      }
  
      // Calculate total scores for each quiz
      const quizTotals = quizzes.map(quiz => {
        const totalScore = quiz.results.reduce((sum, result) => sum + result.score, 0);
        return {
          quizId: quiz.id,
          quizName: quiz.quiz_name,
          totalScore: totalScore,
          averageScore: Math.round(totalScore / quiz.results.length),
        };
      });
  
      res.json(quizTotals);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });
  
  

module.exports = router;
