// auth.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');
const router = express.Router();

const prisma = new PrismaClient();

// Login route
router.post('/login', async (req, res) => {
  const { username } = req.body;
  try {
    const user = await prisma.teacher.findUnique({ where: { uniqueId: username } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user);

    // Generate a session token or JWT (for simplicity, we'll use a basic token here)
    const sessionToken = crypto.randomBytes(20).toString('hex');

    // Store the token and associate it with the user (optional, depends on your needs)

    res.json({ message: 'Login successful', teacherId: user.id, session_token: sessionToken });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
