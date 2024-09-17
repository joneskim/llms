const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();

const prisma = new PrismaClient();

// Get all quizzes for a specific module
router.get('/module/:moduleId', async (req, res) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { moduleId: req.params.moduleId },
      include: { questions: { include: { options: true } } } // Include questions with options
    });
    res.json(quizzes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Create a new quiz
router.post('/', async (req, res) => {
  try {
    const { quiz_name, description, module_id, start_date, due_date, questions } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        quiz_name,
        description,
        moduleId: module_id,
        start_date: new Date(start_date),
        due_date: new Date(due_date),
        questions: {
          create: questions.map((question) => ({
            text: question.text,
            options: {
              create: question.options.map((option) => ({
                text: option.text,
                correct: option.correct || false, // Store if this option is the correct one
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// Get a specific quiz by ID
router.get('/:quizId', async (req, res) => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId },
      include: { questions: { include: { options: true } } } // Include questions with options
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a quiz by ID
router.put('/:quizId', async (req, res) => {
  const { quizId } = req.params;
  const {
    quiz_name,
    description,
    questions,
    start_date,
    due_date
  } = req.body;

  try {
    // Fetch all question IDs associated with the quiz
    const existingQuestions = await prisma.question.findMany({
      where: { quizId },
      select: { id: true },
    });

    const questionIds = existingQuestions.map(q => q.id);

    // Delete all options and answers associated with the questions
    await prisma.option.deleteMany({
      where: {
        questionId: { in: questionIds },
      },
    });

    await prisma.answer.deleteMany({
      where: {
        questionId: { in: questionIds },
      },
    });

    // Delete the questions
    await prisma.question.deleteMany({
      where: { id: { in: questionIds } },
    });

    // Update the quiz details and recreate the questions and options
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        quiz_name,
        description,
        start_date: start_date ? new Date(start_date) : null,
        due_date: due_date ? new Date(due_date) : null,
        questions: {
          create: questions.map((question) => ({
            text: question.text,
            options: {
              create: question.options
                .filter(option => option.text !== undefined) // Filter out undefined options
                .map((option) => ({
                  text: option.text,
                  correct: option.correct || false, // Use the correct flag sent from the frontend
                })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    res.status(200).json(updatedQuiz);
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(400).json({ error: error.message });
  }
});





// Delete a quiz by ID
router.delete('/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;

    // Delete the quiz directly; all associated questions and options will be deleted automatically
    await prisma.quiz.delete({
      where: { id: quizId }
    });

    res.status(200).json({ message: 'Quiz and all associated questions and options deleted successfully' });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

// Submit a quiz
router.post('/:quizId/submit', async (req, res) => {
  const { quizId } = req.params;
  const { student_id, answers } = req.body;

  if (!quizId || !student_id || !answers) {
    return res.status(400).json({ error: 'Invalid request data' });
  }

  try {
    // Fetch quiz with questions and their correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    const questions = quiz.questions;

    let score = 0;

    // Calculate score based on the answers
    for (const question of questions) {
      const correctAnswer = question.correctAnswer[0]?.answerText;
      const studentAnswer = answers[question.id];

      if (correctAnswer === studentAnswer) {
        score += 1; // Increment score for correct answer
      }
    }

    // Save the quiz result
    const quizResult = await prisma.studentQuizResult.create({
      data: {
        studentId: student_id,
        quizId: quizId,
        score: score,
        answers: {
          create: Object.entries(answers).map(([questionId, answerId]) => ({
            questionId: questionId,
            answerText: answerId,
          })),
        },
      },
      include: {
        answers: true,
      },
    });

    const quizResults = await prisma.studentQuizResult.findMany({
      where: { quizId: quizId },
    });

    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
    const averageScore = totalScore / quizResults.length;

    // Update the quiz with the new average score
    await prisma.quiz.update({
      where: { id: quizId },
      data: { averageScore: averageScore },
    });

    res.status(201).json(quizResult);
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all results for a specific quiz
router.get('/:quizId/results', async (req, res) => {
  const { student_id } = req.query;

  if (!student_id) {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  try {
    // Fetch the quiz with questions, options, and correct answers
    const quiz = await prisma.quiz.findUnique({
      where: { id: req.params.quizId },
      include: {
        questions: {
          include: {
            options: true,
            correctAnswer: true,
          },
        },
      },
    });

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz not found' });
    }

    // Fetch the student's results for the quiz
    const studentResults = await prisma.studentQuizResult.findMany({
      where: {
        quizId: req.params.quizId,
        studentId: student_id,
      },
      include: {
        answers: true,
      },
    });

    if (studentResults.length === 0) {
      return res.status(404).json({ error: 'No results found for this student' });
    }

    // Prepare the correct answers
    const correctAnswers = {};
    quiz.questions.forEach(question => {
      const correctAnswer = question.correctAnswer;
      correctAnswers[question.id] = correctAnswer;
    });

    // Map answerText (which holds the ID of the chosen option) to the actual text
    const answers = studentResults[0].answers.map(answer => {
      const question = quiz.questions.find(q => q.id === answer.questionId);
      const option = question?.options.find(option => option.text === answer.answerText);
      return {
        ...answer,
        answerText: option ? option.text : 'Option not found',
      };
    });

    const score = studentResults[0].score;

    res.json({
      score,
      correctAnswers,
      answers,
    });

  } catch (error) {
    console.error('Error fetching quiz results:', error);
    res.status(500).json({ error: 'An error occurred while fetching quiz results' });
  }
});

// Get all quizzes for a specific course and student
router.get('/course/:courseId/student/:studentId', async (req, res) => {
  try {
    const { courseId, studentId } = req.params;

    // Fetch modules related to the course with included quizzes
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        quizzes: {
          include: {
            questions: {
              include: {
                options: true,
              },
            },
            results: {
              where: { studentId },
            },
          },
        },
      },
    });

    if (modules.length === 0) {
      return res.status(404).json({ error: 'No modules found for this course' });
    }

    // Get the quiz results for the student and calculate percentage scores
    const quizResults = modules.flatMap(module => module.quizzes).map(quiz => {
      const studentResult = quiz.results[0]; // Assuming one result per student per quiz
      const totalQuestions = quiz.questions.length;
      const score = studentResult ? studentResult.score : 0;
      const percentageScore = (totalQuestions > 0) ? Math.round((score / totalQuestions) * 100) : 0;

      return {
        quizId: quiz.id,
        quizName: quiz.quiz_name,
        score: studentResult ? studentResult.score : null,
        percentageScore,
      };
    });

    res.json(quizResults);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'An error occurred while fetching quizzes' });
  }
});

module.exports = router;
