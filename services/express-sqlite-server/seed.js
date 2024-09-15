// seed.js

const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker'); // Updated import
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Delete Existing Data in Reverse Order of Dependencies
    console.log('🗑️ Deleting existing data...');
    await prisma.studentQuizResult.deleteMany();
    await prisma.correctAnswer.deleteMany();
    await prisma.answer.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.student.deleteMany();
    await prisma.teacher.deleteMany();
    console.log('✅ Existing data deleted.');

    // 2. Seed Teachers
    console.log('👩‍🏫 Seeding Teachers...');
    const teacherData = [
      {
        uniqueId: 'teacher001',
        name: 'Mr. John Anderson',
        email: 'john.anderson@example.com',
        password: 'hashedpassword1',
      },
      {
        uniqueId: 'teacher002',
        name: 'Ms. Emily Thompson',
        email: 'emily.thompson@example.com',
        password: 'hashedpassword2',
      },
      {
        uniqueId: 'teacher003',
        name: 'Dr. Michael Brown',
        email: 'michael.brown@example.com',
        password: 'hashedpassword3',
      },
      {
        uniqueId: 'teacher004',
        name: 'Mrs. Sarah Davis',
        email: 'sarah.davis@example.com',
        password: 'hashedpassword4',
      },
      {
        uniqueId: 'teacher005',
        name: 'Prof. William Garcia',
        email: 'william.garcia@example.com',
        password: 'hashedpassword5',
      },
    ];

    const teachers = [];
    for (const t of teacherData) {
      const teacher = await prisma.teacher.create({
        data: t,
      });
      teachers.push(teacher);
      console.log(`✅ Teacher seeded: ${teacher.name}`);
    }

    // 3. Seed Students
    console.log('🧑‍🎓 Seeding Students...');
    const studentData = [];
    for (let i = 1; i <= 50; i++) {
      studentData.push({
        uniqueId: `student${i.toString().padStart(3, '0')}`,
        name: faker.person.fullName(), // Updated method
        email: faker.internet.email(),
        password: faker.internet.password(),
      });
    }

    const students = [];
    for (const s of studentData) {
      const student = await prisma.student.create({
        data: s,
      });
      students.push(student);
      console.log(`✅ Student seeded: ${student.name}`);
    }

    // 4. Seed Courses
    console.log('📚 Seeding Courses...');
    const courseNames = [
      'Physics 101',
      'Chemistry 101',
      'Mathematics 101',
      'Biology 101',
      'Computer Science 101',
      'History 101',
      'Literature 101',
      'Art 101',
      'Economics 101',
      'Philosophy 101',
    ];

    const courseDescriptions = [
      'Introduction to fundamental concepts in Physics.',
      'Basic principles and theories of Chemistry.',
      'Foundational topics in Mathematics.',
      'Exploring the basics of Biology.',
      'Introduction to Computer Science and programming.',
      'Overview of historical events and movements.',
      'Study of classical and modern literature.',
      'Fundamentals of Art and design.',
      'Introduction to Economics and market structures.',
      'Exploration of philosophical thoughts and theories.',
    ];

    const courses = [];
    for (let i = 0; i < courseNames.length; i++) {
      const course = await prisma.course.create({
        data: {
          course_name: courseNames[i],
          description: courseDescriptions[i],
          teacherId: teachers[i % teachers.length].id, // Assign teachers in a round-robin fashion
        },
      });
      courses.push(course);
      console.log(`✅ Course seeded: ${course.course_name}`);
    }

    // 5. Enroll Students in Courses
    console.log('🔗 Enrolling Students in Courses...');
    for (const course of courses) {
      // Randomly select 20-30 students to enroll in each course
      const numberOfStudents = faker.number.int({ min: 20, max: 30 }); // Updated method
      const shuffledStudents = faker.helpers.shuffle(students);
      const enrolledStudents = shuffledStudents.slice(0, numberOfStudents);

      await prisma.course.update({
        where: { id: course.id },
        data: {
          students: {
            connect: enrolledStudents.map((student) => ({ id: student.id })),
          },
        },
      });
      console.log(`✅ Enrolled ${numberOfStudents} students in Course: ${course.course_name}`);
    }

    // 6. Seed Modules
    console.log('📦 Seeding Modules...');
    const modules = [];
    for (const course of courses) {
      const numberOfModules = faker.number.int({ min: 3, max: 5 }); // Updated method
      for (let i = 1; i <= numberOfModules; i++) {
        const module = await prisma.module.create({
          data: {
            module_name: `${course.course_name} - Module ${i}`,
            description: faker.lorem.paragraph(),
            courseId: course.id,
          },
        });
        modules.push(module);
        console.log(`✅ Module seeded: ${module.module_name}`);
      }
    }

    // 7. Seed Quizzes
    console.log('📝 Seeding Quizzes...');
    const quizzes = [];
    for (const module of modules) {
      const numberOfQuizzes = faker.number.int({ min: 2, max: 4 }); // Updated method
      for (let i = 1; i <= numberOfQuizzes; i++) {
        const quiz = await prisma.quiz.create({
          data: {
            quiz_name: `${module.module_name} - Quiz ${i}`,
            description: faker.lorem.sentences(),
            moduleId: module.id,
            averageScore: null, // Initialize averageScore as null; it can be updated later
          },
        });
        quizzes.push(quiz);
        console.log(`✅ Quiz seeded: ${quiz.quiz_name}`);
      }
    }

    // 8. Seed Questions
    console.log('❓ Seeding Questions...');
    const questions = [];
    for (const quiz of quizzes) {
      const numberOfQuestions = faker.number.int({ min: 5, max: 15 }); // Updated method
      for (let i = 1; i <= numberOfQuestions; i++) {
        const question = await prisma.question.create({
          data: {
            text: faker.lorem.sentence(),
            quizId: quiz.id,
          },
        });
        questions.push(question);
        console.log(`✅ Question seeded: "${question.text}"`);
      }
    }

    // 9. Seed Options and Correct Answers
    console.log('🗂️ Seeding Options and Correct Answers...');
    for (const question of questions) {
      const optionsForQuestion = [];
      for (let i = 0; i < 4; i++) {
        const optionText = faker.lorem.words(3);
        const option = await prisma.option.create({
          data: {
            text: optionText,
            questionId: question.id,
          },
        });
        optionsForQuestion.push(option);
        console.log(`✅ Option seeded: "${option.text}" for Question ID: ${question.id}`);
      }

      // Assign one CorrectAnswer per Question
      const correctOption = faker.helpers.arrayElement(optionsForQuestion);
      const correctAnswer = await prisma.correctAnswer.create({
        data: {
          questionId: question.id,
          answerText: correctOption.text,
        },
      });
      console.log(`✅ Correct Answer seeded for Question ID: ${question.id}`);
    }

    // 10. Seed StudentQuizResults
    console.log('📊 Seeding Student Quiz Results...');
    for (const student of students) {
      // Each student takes 10-20 quizzes randomly
      const numberOfQuizzesTaken = faker.number.int({ min: 10, max: 20 }); // Updated method
      const shuffledQuizzes = faker.helpers.shuffle(quizzes);
      const takenQuizzes = shuffledQuizzes.slice(0, numberOfQuizzesTaken);

      for (const quiz of takenQuizzes) {
        // Check if the student is enrolled in the course that the quiz belongs to
        const courseId = await prisma.quiz.findUnique({
          where: { id: quiz.id },
          select: { module: { select: { courseId: true } } },
        }).then(res => res.module.courseId);

        const isEnrolled = await prisma.course.findFirst({
          where: {
            id: courseId,
            students: { some: { id: student.id } },
          },
        });

        if (!isEnrolled) {
          // Skip if the student is not enrolled in the course
          continue;
        }

        // Check for existing StudentQuizResult to prevent duplicates
        const existingQuizResult = await prisma.studentQuizResult.findUnique({
          where: {
            studentId_quizId: { // Must match the unique constraint name
              studentId: student.id,
              quizId: quiz.id,
            },
          },
        });

        if (existingQuizResult) {
          continue; // Skip if already exists
        }

        const score = faker.number.int({ min: 0, max: 100 }); // Updated method
        const completedAt = faker.date.past({ years: 1 }); // Updated method

        const quizResult = await prisma.studentQuizResult.create({
          data: {
            studentId: student.id,
            quizId: quiz.id,
            score,
            completedAt,
            answers: {
              create: await generateAnswersForQuiz(quiz.id, score),
            },
          },
        });

        console.log(`✅ Quiz Result seeded for Student ID: ${student.id}, Quiz ID: ${quiz.id}, Score: ${score}`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error inserting sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to generate answers for a quiz based on score
async function generateAnswersForQuiz(quizId, score) {
  // Fetch all questions and their correct answers for the quiz
  const questions = await prisma.question.findMany({
    where: { quizId },
    include: { correctAnswer: true, options: true },
  });

  // Determine the number of correct answers based on score
  const totalQuestions = questions.length;
  const correctAnswersCount = Math.round((score / 100) * totalQuestions);

  // Shuffle questions
  const shuffledQuestions = faker.helpers.shuffle(questions);

  // Select questions that will be answered correctly
  const correctlyAnsweredQuestions = shuffledQuestions.slice(0, correctAnswersCount);

  const answersData = [];

  for (const question of questions) {
    let answerText;
    if (correctlyAnsweredQuestions.includes(question)) {
      // Correct answer
      answerText = question.correctAnswer.answerText;
    } else {
      // Incorrect answer: select a random option that's not the correct one
      const incorrectOptions = question.options.filter(opt => opt.text !== question.correctAnswer.answerText);
      const randomIncorrectOption = faker.helpers.arrayElement(incorrectOptions);
      answerText = randomIncorrectOption.text;
    }

    answersData.push({
      answerText,
      questionId: question.id,
    });
  }

  return answersData;
}

main();
