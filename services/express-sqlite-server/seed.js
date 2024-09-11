const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {



    console.log('Existing data deleted.');

    // Seed Teacher
    console.log('Seeding Teacher...');
    const teacher = await prisma.teacher.create({
      data: {
        uniqueId: 'teacher001',
        name: 'Mr. Anderson',
        email: 'anderson@example.com',
        password: 'hashedpassword1',
      },
    });

    console.log('Teacher seeded:', teacher);

    // Seed Students
    console.log('Seeding Students...');
    const students = await Promise.all([
      prisma.student.create({
        data: {
          uniqueId: 'student001',
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: 'hashedpassword4',
        },
      }),
    ]);

    console.log('Students seeded:', students);

    // Seed Course
    console.log('Seeding Course...');
    const course = await prisma.course.create({
      data: {
        course_name: 'Physics 101',
        description: 'Introduction to Physics',
        teacherId: teacher.id, // Link course to teacher
        students: {
          connect: students.map(student => ({ id: student.id })),
        },
      },
    });

    console.log('Course seeded:', course);

    // Seed Modules
    console.log('Seeding Modules...');
    const modules = await Promise.all([
      prisma.module.create({
        data: {
          module_name: 'Module 1',
          description: 'Basics of Physics',
          courseId: course.id, // Link module to course
        },
      }),
    ]);

    console.log('Modules seeded:', modules);

    // Seed Quizzes
    console.log('Seeding Quizzes...');
    const quizzes = await Promise.all([
      prisma.quiz.create({
        data: {
          quiz_name: 'Physics Quiz 1',
          description: 'Covers basic concepts',
          moduleId: modules[0].id, // Link quiz to module
        },
      }),
    ]);

    console.log('Quizzes seeded:', quizzes);

    // Seed Questions
    console.log('Seeding Questions...');
    const questions = await Promise.all([
      prisma.question.create({
        data: {
          text: 'What is the unit of force?',
          quizId: quizzes[0].id, // Link question to quiz
          options: {
            create: [
              { text: 'Newton' },
              { text: 'Joule' },
              { text: 'Watt' },
              { text: 'Pascal' },
            ],
          },
        },
      }),
    ]);

    console.log('Questions seeded:', questions);

    // Seed Correct Answers
    console.log('Seeding Correct Answers...');
    const correctAnswers = await Promise.all([
      prisma.correctAnswer.create({
        data: {
          questionId: questions[0].id, // Link correct answer to question
          answerText: 'Newton',
        },
      }),
    ]);

    console.log('Correct Answers seeded:', correctAnswers);

  } catch (error) {
    console.error('Error inserting sample data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
