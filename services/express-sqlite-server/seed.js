const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');

    // 1. Delete Existing Data in Reverse Order of Dependencies
    console.log('🗑️ Deleting existing data...');
    await prisma.answer.deleteMany();
    await prisma.studentQuizResult.deleteMany();
    await prisma.correctAnswer.deleteMany();
    await prisma.option.deleteMany();
    await prisma.question.deleteMany();
    await prisma.quiz.deleteMany();
    await prisma.assignment.deleteMany();
    await prisma.module.deleteMany();
    await prisma.course.deleteMany();
    await prisma.notification.deleteMany();
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
        password: 'hashedpassword1', // Use a real hash in production
      },
      {
        uniqueId: 'teacher002',
        name: 'Ms. Emily Johnson',
        email: 'emily.johnson@example.com',
        password: 'hashedpassword2',
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
        name: faker.person.fullName(),
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
    ];

    const courses = [];
    for (let i = 0; i < courseNames.length; i++) {
      const course = await prisma.course.create({
        data: {
          course_name: courseNames[i],
          description: `${courseNames[i]} Description`,
          teacherId: teachers[i % teachers.length].id,
        },
      });
      courses.push(course);
      console.log(`✅ Course seeded: ${course.course_name}`);
    }

    // 5. Enroll Students in Courses
    console.log('🔗 Enrolling Students in Courses...');
    for (const course of courses) {
      const numberOfStudents = faker.number.int({ min: 20, max: 30 });
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
      const numberOfModules = faker.number.int({ min: 3, max: 5 });
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
      const numberOfQuizzes = faker.number.int({ min: 2, max: 4 });
      for (let i = 1; i <= numberOfQuizzes; i++) {
        const startDate = faker.date.past({ years: 1 });
        const dueDate = faker.date.future({ years: 1, refDate: startDate });
        const quiz = await prisma.quiz.create({
          data: {
            quiz_name: `${module.module_name} - Quiz ${i}`,
            description: faker.lorem.sentences(),
            moduleId: module.id,
            averageScore: null,
            start_date: startDate,
            due_date: dueDate,
          },
        });
        quizzes.push(quiz);
        console.log(`✅ Quiz seeded: ${quiz.quiz_name}`);
      }
    }

    // 8. Seed Assignments
    console.log('📝 Seeding Assignments...');
    const assignments = [];
    for (const module of modules) {
      const numberOfAssignments = faker.number.int({ min: 1, max: 3 });
      for (let i = 1; i <= numberOfAssignments; i++) {
        const startDate = faker.date.past({ years: 1 });
        const dueDate = faker.date.future({ years: 1, refDate: startDate });
        const assignment = await prisma.assignment.create({
          data: {
            assignment_name: `${module.module_name} - Assignment ${i}`,
            description: faker.lorem.sentences(),
            moduleId: module.id,
            start_date: startDate,
            due_date: dueDate,
          },
        });
        assignments.push(assignment);
        console.log(`✅ Assignment seeded: ${assignment.assignment_name}`);
      }
    }

    // 9. Seed Questions
    console.log('❓ Seeding Questions...');
    const questions = [];
    for (const quiz of quizzes) {
      const numberOfQuestions = faker.number.int({ min: 5, max: 15 });
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

    // 10. Seed Options and Correct Answers
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

      // Assign a random option as the CorrectAnswer for the Question
      const correctAnswerIndex = faker.number.int({ min: 0, max: 3 });
      await prisma.correctAnswer.create({
        data: {
          questionId: question.id,
          answerText: optionsForQuestion[correctAnswerIndex].text,
        },
      });
      console.log(`✅ Correct Answer seeded for Question ID: ${question.id}`);
    }

    // 11. Seed Student Quiz Results
    console.log('📊 Seeding Student Quiz Results...');
    for (const student of students) {
      const numberOfQuizzesTaken = faker.number.int({ min: 10, max: 20 });
      const shuffledQuizzes = faker.helpers.shuffle(quizzes);
      const takenQuizzes = shuffledQuizzes.slice(0, numberOfQuizzesTaken);

      for (const quiz of takenQuizzes) {
        const module = await prisma.module.findUnique({
          where: { id: quiz.moduleId },
          select: { courseId: true },
        });

        const isEnrolled = await prisma.course.findFirst({
          where: {
            id: module.courseId,
            students: { some: { id: student.id } },
          },
        });

        if (!isEnrolled) {
          continue;
        }

        const existingQuizResult = await prisma.studentQuizResult.findUnique({
          where: {
            studentId_quizId: {
              studentId: student.id,
              quizId: quiz.id,
            },
          },
        });

        if (existingQuizResult) {
          continue;
        }

        const score = faker.number.int({ min: 0, max: 100 });
        const completedAt = faker.date.past({ years: 1 });

        const answersData = await generateAnswersForQuiz(quiz.id, score);

        await prisma.studentQuizResult.create({
          data: {
            studentId: student.id,
            quizId: quiz.id,
            score,
            completedAt,
            answers: {
              create: answersData,
            },
          },
        });

        console.log(`✅ Quiz Result seeded for Student ID: ${student.id}, Quiz ID: ${quiz.id}, Score: ${score}`);
      }
    }

    // 12. Seed Notifications
    console.log('🔔 Seeding Notifications...');
    for (const teacher of teachers) {
      const numNotifications = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < numNotifications; i++) {
        await prisma.notification.create({
          data: {
            message: faker.lorem.sentence(),
            date: faker.date.recent(),
            teacherId: teacher.id,
          },
        });
        console.log(`✅ Notification seeded for Teacher ID: ${teacher.id}`);
      }
    }

    for (const student of students) {
      const numNotifications = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < numNotifications; i++) {
        await prisma.notification.create({
          data: {
            message: faker.lorem.sentence(),
            date: faker.date.recent(),
            studentId: student.id,
          },
        });
        console.log(`✅ Notification seeded for Student ID: ${student.id}`);
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
  const questions = await prisma.question.findMany({
    where: { quizId },
    include: { correctAnswer: true, options: true },
  });

  const totalQuestions = questions.length;
  const correctAnswersCount = Math.round((score / 100) * totalQuestions);

  const shuffledQuestions = faker.helpers.shuffle(questions);
  const correctlyAnsweredQuestions = shuffledQuestions.slice(0, correctAnswersCount);

  const answersData = [];

  for (const question of questions) {
    let answerText;
    if (correctlyAnsweredQuestions.includes(question)) {
      answerText = question.correctAnswer.answerText;
    } else {
      const incorrectOptions = question.options.filter(
        (opt) => opt.text !== question.correctAnswer.answerText
      );
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
