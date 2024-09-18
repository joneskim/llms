const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all modules
router.get('/', async (req, res) => {
  try {
    const modules = await prisma.module.findMany();
    res.json(modules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all modules for a specific course
router.get('/course/:courseId', async (req, res) => {
  try {
    const modules = await prisma.module.findMany({
      where: { courseId: req.params.courseId },
    });
    res.json(modules);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a specific module by ID
router.get('/:moduleId', async (req, res) => {
  try {
    const module = await prisma.module.findUnique({
      where: { id: req.params.moduleId },
    });
    if (!module) {
      return res.status(404).json({ error: 'Module not found' });
    }
    res.json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new module
// router.post('/', async (req, res) => {
//   try {
//     const module = await prisma.module.create({
//       data: req.body,
//     });
//     res.status(201).json(module);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
// router.post('/', async (req, res) => {
//   try {
//     const { module_name, description, courseId, startDate, endDate } = req.body;

//     console.log('Received data:', req.body);

//     // Ensure the courseId exists in the Course table
//     const courseExists = await prisma.course.findUnique({
//       where: { id: courseId },
//     });

//     if (!courseExists) {
//       return res.status(404).json({ error: 'Course not found' });
//     }

//     // Create the module
//     const module = await prisma.module.create({
//       data: {
//         module_name,
//         description,
//         courseId,
//         startDate: new Date(startDate),  // assuming you want to store the start and end dates as DateTime
//         endDate: new Date(endDate),      // in the module schema
//       },
//     });

//     res.status(201).json(module);
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });
router.post('/', async (req, res) => {
  const { course_id, module_name, description } = req.body;

  console.log('Received data:', req.body);
  
  if (!module_name || !course_id) {
    return res.status(400).json({ error: "Module name and courseId are required." });
  }

  try {
    const newModule = await prisma.module.create({
      data: {
        module_name,
        description,
        courseId: course_id, // Ensure this matches your database schema
      },
    });
    res.status(201).json(newModule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



// Update a module by ID
router.put('/:moduleId', async (req, res) => {
  try {
    const module = await prisma.module.update({
      where: { id: req.params.moduleId },
      data: req.body,
    });
    res.json(module);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a module by ID
router.delete('/:moduleId', async (req, res) => {
  try {
    await prisma.module.delete({
      where: { id: req.params.moduleId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
