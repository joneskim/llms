const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const prisma = new PrismaClient();

/**
 * Helper function to generate a list of dates between two dates.
 * @param {Date} start - Start date.
 * @param {Date} end - End date.
 * @returns {Date[]} - Array of Date objects.
 */
function generateDateRange(start, end) {
  const dates = [];
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

/**
 * Helper function to format Date objects to ISO strings.
 * @param {Date} date - Date object.
 * @returns {string} - ISO formatted date string.
 */
function formatDate(date) {
  return date.toISOString();
}

/**
 * Helper function to get the next available date with less than maxEventsPerDay.
 * @param {Date[]} shuffledDateRange - Shuffled array of Date objects.
 * @param {Object} eventDateMap - Map tracking events per date.
 * @param {number} maxEventsPerDay - Maximum allowed events per day.
 * @returns {Date} - Next available Date object.
 */
function getNextAvailableDate(shuffledDateRange, eventDateMap, maxEventsPerDay) {
  for (const date of shuffledDateRange) {
    const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    if (!eventDateMap[dateKey]) {
      eventDateMap[dateKey] = 1;
      return new Date(date);
    } else if (eventDateMap[dateKey] < maxEventsPerDay) {
      eventDateMap[dateKey] += 1;
      return new Date(date);
    }
  }
  // If all dates are saturated, return a random date within the range
  return faker.date.between({ from: shuffledDateRange[0], to: shuffledDateRange[shuffledDateRange.length - 1] });
}

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

    // 7. Define Controlled Time Window and Initialize Date Pool
    console.log('📅 Initializing event date pool...');
    const today = new Date();
    const sixMonthsLater = new Date();
    sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
    const dateRange = generateDateRange(today, sixMonthsLater);

    // Shuffle the date range to randomize event distribution
    const shuffledDateRange = faker.helpers.shuffle(dateRange);

    // Initialize a map to track the number of main events per day (Quizzes & Assignments)
    const mainEventDateMap = {};
    const maxMainEventsPerDay = 1; // One event per day to prevent overlap

    // Initialize a map to track the number of quiz results per day
    const quizResultDateMap = {};
    const maxQuizResultsPerDay = 3; // Limit to 3 quiz results per day

    // 8. Seed Quizzes and Assignments with Even Distribution
    console.log('📝 Seeding Quizzes and Assignments with spread out dates...');
    const quizzes = [];
    const assignments = [];

    for (const module of modules) {
      // Randomly decide the number of quizzes and assignments per module
      const numberOfQuizzes = faker.number.int({ min: 2, max: 4 });
      const numberOfAssignments = faker.number.int({ min: 1, max: 3 });

      // Seed Quizzes
      for (let i = 1; i <= numberOfQuizzes; i++) {
        const startDate = getNextAvailableDate(shuffledDateRange, mainEventDateMap, maxMainEventsPerDay);
        const dueDate = new Date(startDate); // One-day event

        const quiz = await prisma.quiz.create({
          data: {
            quiz_name: `${module.module_name} - Quiz ${i}`,
            description: faker.lorem.sentences(),
            moduleId: module.id,
            averageScore: null,
            start_date: formatDate(startDate),
            due_date: formatDate(dueDate),
          },
        });
        quizzes.push(quiz);
        console.log(`✅ Quiz seeded: ${quiz.quiz_name} (Date: ${startDate.toDateString()})`);
      }

      // Seed Assignments
      for (let i = 1; i <= numberOfAssignments; i++) {
        const startDate = getNextAvailableDate(shuffledDateRange, mainEventDateMap, maxMainEventsPerDay);
        const dueDate = new Date(startDate); // One-day event

        const assignment = await prisma.assignment.create({
          data: {
            assignment_name: `${module.module_name} - Assignment ${i}`,
            description: faker.lorem.sentences(),
            moduleId: module.id,
            start_date: formatDate(startDate),
            due_date: formatDate(dueDate),
          },
        });
        assignments.push(assignment);
        console.log(`✅ Assignment seeded: ${assignment.assignment_name} (Date: ${startDate.toDateString()})`);
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

    // 11. Seed Student Quiz Results with Spread Out Dates and Calculated Scores
    console.log('📊 Seeding Student Quiz Results with calculated scores...');
    for (const quiz of quizzes) {
      let totalScoreSum = 0; // Sum of all scores for this quiz
      let totalResults = 0;  // Number of results for this quiz

      for (const student of students) {
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

        const answersData = await generateAnswersForQuiz(quiz.id);
        const correctAnswers = answersData.filter(answer => answer.isCorrect).length;
        const score = Math.round((correctAnswers / answersData.length) * 100);

        totalScoreSum += score;
        totalResults++;

        const completedAt = assignResultDate(quiz, quizResultDateMap, maxQuizResultsPerDay);

        await prisma.studentQuizResult.create({
          data: {
            studentId: student.id,
            quizId: quiz.id,
            score,
            completedAt: formatDate(completedAt),
            answers: {
              create: answersData.map(answer => ({
                answerText: answer.answerText,
                questionId: answer.questionId,
              })),
            },
          },
        });

        console.log(`✅ Quiz Result seeded for Student ID: ${student.id}, Quiz ID: ${quiz.id}, Score: ${score}, Completed At: ${completedAt.toDateString()}`);
      }

      // Update quiz with the average score
      if (totalResults > 0) {
        const averageScore = Math.round(totalScoreSum / totalResults);
        await prisma.quiz.update({
          where: { id: quiz.id },
          data: { averageScore },
        });
        console.log(`📊 Quiz ID: ${quiz.id} updated with Average Score: ${averageScore}`);
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
            date: formatDate(faker.date.recent()),
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
            date: formatDate(faker.date.recent()),
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

/**
 * Helper function to assign a completedAt date for a quiz result.
 * Ensures that the date is within 1-7 days after the quiz date
 * and does not exceed the maximum number of results per day.
 * @param {Object} quiz - Quiz object containing start_date.
 * @param {Object} quizResultDateMap - Map tracking quiz results per date.
 * @param {number} maxQuizResultsPerDay - Maximum allowed quiz results per day.
 * @returns {Date} - Assigned completedAt Date object.
 */
function assignResultDate(quiz, quizResultDateMap, maxQuizResultsPerDay) {
  const quizDate = new Date(quiz.start_date);
  const windowStart = new Date(quizDate);
  windowStart.setDate(windowStart.getDate() + 1); // 1 day after quiz date
  const windowEnd = new Date(quizDate);
  windowEnd.setDate(windowEnd.getDate() + 7); // 7 days after quiz date

  const resultDateRange = generateDateRange(windowStart, windowEnd);
  const shuffledResultDates = faker.helpers.shuffle(resultDateRange);

  for (const date of shuffledResultDates) {
    const dateKey = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    if (!quizResultDateMap[dateKey] || quizResultDateMap[dateKey] < maxQuizResultsPerDay) {
      if (!quizResultDateMap[dateKey]) {
        quizResultDateMap[dateKey] = 1;
      } else {
        quizResultDateMap[dateKey] += 1;
      }
      return new Date(date);
    }
  }

  // If no date available in window, assign a random date within the 6-month pool
  // For simplicity, use the main event date pool to avoid creating a new date pool
  // You can create a separate pool if needed
  const sixMonthsLater = new Date(quizDate);
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
  const randomDate = faker.date.between({ from: windowEnd, to: sixMonthsLater });
  const randomDateKey = randomDate.toISOString().split('T')[0];
  if (!quizResultDateMap[randomDateKey] || quizResultDateMap[randomDateKey] < maxQuizResultsPerDay) {
    if (!quizResultDateMap[randomDateKey]) {
      quizResultDateMap[randomDateKey] = 1;
    } else {
      quizResultDateMap[randomDateKey] += 1;
    }
    return new Date(randomDate);
  }

  // As a last resort, allow exceeding the max
  return new Date(randomDate);
}

/**
 * Helper function to generate answers for a quiz based on random correctness
 * @param {number} quizId - ID of the quiz
 * @returns {Array} - Array of answer objects to be inserted
 */
async function generateAnswersForQuiz(quizId) {
  const questions = await prisma.question.findMany({
    where: { quizId },
    include: { correctAnswer: true, options: true },
  });

  const answersData = [];

  for (const question of questions) {
    const isCorrect = faker.datatype.boolean(); // Randomly determine if the answer is correct
    let answerText;

    if (isCorrect) {
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
      isCorrect, // Include this if needed in your logic, otherwise remove it
    });
  }

  return answersData;
}

main();
