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
    const quiz = await prisma.quiz.create({
      data: {
        quiz_name: req.body.quiz_name,
        description: req.body.description,
        moduleId: req.body.moduleId,
        questions: {
          create: req.body.questions.map(question => ({
            text: question.text,
            options: {
              create: question.options.map(option => ({
                text: option.text
              }))
            }
          }))
        }
      },
      include: { questions: { include: { options: true } } } // Include questions with options
    });
    res.status(201).json(quiz);
  } catch (error) {
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
  try {
    const quiz = await prisma.quiz.update({
      where: { id: req.params.quizId },
      data: {
        quiz_name: req.body.quiz_name,
        description: req.body.description,
        questions: {
          deleteMany: {}, // Clear existing questions
          create: req.body.questions.map(question => ({
            text: question.text,
            options: {
              deleteMany: {}, // Clear existing options
              create: question.options.map(option => ({
                text: option.text
              }))
            }
          }))
        }
      },
      include: { questions: { include: { options: true } } } // Include questions with options
    });
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a quiz by ID
router.delete('/:quizId', async (req, res) => {
  try {
    await prisma.quiz.delete({
      where: { id: req.params.quizId },
    });
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:quizId/submit', async (req, res) => {
    const { quizId } = req.params;
    const { student_id, answers } = req.body;

    if (!quizId || !student_id || !answers) {
        return res.status(400).json({ error: 'Invalid request data' });
    }

    console.log('Received quiz submission:', { quizId, student_id, answers });

    try {
        // Fetch quiz with questions and their correct answers
        const quiz = await prisma.quiz.findUnique({
            where: { id: quizId },
            include: {
                questions: {
                    include: {
                        options: true,
                        correctAnswer: true, // Ensure this field exists in your schema
                    },
                },
            },
        });

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        const questions = quiz.questions;
        console.log('Quiz questions:', questions);

        let score = 0;

        // Calculate score based on the answers
        for (const question of questions) {
            console.log('Question:', question);
            const correctAnswer = question.correctAnswer[0]?.answerText;
            console.log('Correct answer:', correctAnswer);
            const studentAnswer = answers[question.id];
            const studentAnswerOption = question.options.find(option => option.id === studentAnswer)?.text;
            console.log('Student answer option:', studentAnswerOption);
            console.log('Student answer:', studentAnswer);

            if (correctAnswer === studentAnswerOption) {
                score += 1; // Increment score for correct answer
            }
        }

        console.log('Quiz score:', score);

        // Save the quiz result
        const quizResult = await prisma.studentQuizResult.create({
            data: {
                studentId: student_id,
                quizId: quizId,
                score: score,
                answers: {
                    create: Object.entries(answers).map(([questionId, answerId]) => ({
                        questionId: questionId,
                        answerText: answerId, // Adjust based on your schema
                    })),
                },
            },
            include: {
                answers: true, // Include answers to verify insertion
            },
        });

        console.log('Quiz result:', quizResult);

        res.status(201).json(quizResult);
    } catch (error) {
        console.error('Error:', error);
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
                        correctAnswer: true, // Ensure this field exists in your schema
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
            const correctAnswer = question.correctAnswer[0]?.answerText;
            correctAnswers[question.id] = correctAnswer;
            console.log('Correct answer:', correctAnswer);
        });

        // now fetch answer with id answerText.. answerText is apparently the id of the answer.. fetch the option with that id
        const answers = studentResults[0].answers;
        for (const answer of answers) {
            const answerText = answer.answerText;
            const option = quiz.questions.find(question => question.id === answer.questionId).options.find(option => option.id === answerText);
            answer.answerText = option.text;
        }
        

        const score = studentResults[0].score;
        console.log('Student score:', score);
        console.log('Correct answers:', correctAnswers);
        console.log('Student answers:', studentResults[0].answers); 

        res.json({
            score: score,
            correctAnswers: correctAnswers,
            answers: studentResults[0].answers,
        });

    } catch (error) {
        console.error('Error fetching quiz results:', error);
        res.status(500).json({ error: 'An error occurred while fetching quiz results' });
    }
});

  

router.get('/course/:courseId', async (req, res) => {
    console.log('Received request parameters:', req.params);
    
    try {
      const { courseId } = req.params;
      console.log('Course ID:', courseId);
  
      // Fetch modules related to the course with included quizzes
      const modules = await prisma.module.findMany({
        where: { courseId: courseId },
        include: {
          quizzes: {
            include: {
              questions: {
                include: {
                  options: true
                }
              },
              results: true
            }
          }
        }
      });

    // const modules = await prisma.module.findMany({
    //     where: { courseId: courseId },
    //     include: {
    //       quizzes: true // First level include
    //     }
    //   });
      
      console.log(modules);
  
      console.log('Fetched modules with quizzes:', modules);
  
      if (modules.length === 0) {
        return res.status(404).json({ error: 'No modules found for this course' });
      }
  
      // Extract quizzes from modules
      const quizzes = modules.flatMap(module => module.quizzes);
      console.log('Quizzes:', quizzes);
      // Optionally filter quizzes based on student ID or other criteria
      // (e.g., quizzes = quizzes.filter(quiz => quiz.someCondition))
  
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: 'An error occurred while fetching quizzes' });
    }
  });
  

module.exports = router;
