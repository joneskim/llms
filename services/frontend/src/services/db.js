import { openDB } from 'idb';

// Initialize IndexedDB database and create object stores
// const initDB = async () => {
//   try {
//     const db = await openDB('lmsDatabase3', 1, {
//       upgrade(db) {
//         if (!db.objectStoreNames.contains('users')) {
//           db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('courses')) {
//           db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('students_courses')) {
//           db.createObjectStore('students_courses', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('modules')) {
//           db.createObjectStore('modules', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('assignments')) {
//           db.createObjectStore('assignments', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('quizzes')) {
//           db.createObjectStore('quizzes', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('questions')) {
//           db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('answers')) {
//           db.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('student_quiz_scores')) {
//           db.createObjectStore('student_quiz_scores', { keyPath: 'id', autoIncrement: true });
//         }
//         if (!db.objectStoreNames.contains('progress_tracking')) {
//           db.createObjectStore('progress_tracking', { keyPath: 'id', autoIncrement: true });
//         }
//       },
//     });
//     return db;
//   } catch (error) {
//     console.error('Failed to open IndexedDB:', error);
//   }
// };

const initDB = async () => {
  try {
    const db = await openDB('lmsDatabase6', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('users')) {
          db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('courses')) {
          db.createObjectStore('courses', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('students_courses')) {
          db.createObjectStore('students_courses', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('modules')) {
          db.createObjectStore('modules', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('assignments')) {
          db.createObjectStore('assignments', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('tasks')) {
          db.createObjectStore('tasks', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('quizzes')) {
          db.createObjectStore('quizzes', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('questions')) {
          db.createObjectStore('questions', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('answers')) {
          db.createObjectStore('answers', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('student_quiz_scores')) {
          // Store for student quiz results with question-level details
          db.createObjectStore('student_quiz_scores', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('progress_tracking')) {
          db.createObjectStore('progress_tracking', { keyPath: 'id', autoIncrement: true });
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Failed to open IndexedDB:', error);
  }
};

const generateUniqueId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};


// Clear existing IndexedDB data to avoid upgrade issues
const clearDatabase = async () => {
  try {
    const db = await initDB();
    const objectStoreNames = Array.from(db.objectStoreNames);
    for (const storeName of objectStoreNames) {
      db.deleteObjectStore(storeName);
    }
    console.log('Cleared existing database.');
  } catch (error) {
    console.error('Error clearing database:', error);
  }
};

const seedDatabaseWithFullQuizzes = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(
      ['users', 'courses', 'modules', 'quizzes', 'questions', 'answers', 'students_courses', 'student_quiz_scores'],
      'readwrite'
    );

    const usersStore = tx.objectStore('users');
    const coursesStore = tx.objectStore('courses');
    const modulesStore = tx.objectStore('modules');
    const quizzesStore = tx.objectStore('quizzes');
    const questionsStore = tx.objectStore('questions');
    const answersStore = tx.objectStore('answers');
    const studentsCoursesStore = tx.objectStore('students_courses');
    const scoresStore = tx.objectStore('student_quiz_scores');

    // Seed Users (1 Teacher + 20 Students)
    await usersStore.put({ id: 1, username: 'teacher1', name: 'John Doe', email: 'johndoe@example.com', role: 'teacher' });

    for (let i = 2; i <= 21; i++) {
      await usersStore.put({ id: i, username: `student${i - 1}`, name: `Student ${i - 1}`, email: `student${i - 1}@example.com`, role: 'student', uniqueId: generateUniqueId() });
    }

    // Seed Courses
    const courses = [
      { id: 1, course_name: 'Physics 101', description: 'Introduction to basic physics concepts', teacher_id: 1 },
      { id: 2, course_name: 'Mathematics 101', description: 'Introduction to basic mathematics concepts', teacher_id: 1 },
      { id: 3, course_name: 'Chemistry 101', description: 'Introduction to basic chemistry concepts', teacher_id: 1 },
      { id: 4, course_name: 'Biology 101', description: 'Introduction to basic biology concepts', teacher_id: 1 },
      { id: 5, course_name: 'Computer Science 101', description: 'Introduction to basic programming concepts', teacher_id: 1 },
      { id: 6, course_name: 'History 101', description: 'Introduction to world history', teacher_id: 1 },
      { id: 7, course_name: 'English 101', description: 'Introduction to English literature', teacher_id: 1 }
    ];

    for (const course of courses) {
      await coursesStore.put(course);
    }

    // Seed Modules
    let moduleId = 1;
    for (const course of courses) {
      for (let j = 1; j <= 4; j++) {
        await modulesStore.put({ id: moduleId++, module_name: `Module ${j}`, description: `Description for module ${j}`, course_id: course.id });
      }
    }

    // Seed Quizzes with Questions and Answers
    let quizId = 1;
    let questionId = 1;
    let answerId = 1;

    for (let i = 1; i <= moduleId - 1; i++) {
      for (let j = 1; j <= 20; j++) { // 20 quizzes per module
        await quizzesStore.put({ id: quizId, quiz_name: `Quiz ${j}`, description: `Test your knowledge on Module ${i}`, module_id: i });

        // Add 5 questions for each quiz
        for (let k = 1; k <= 5; k++) {
          await questionsStore.put({ id: questionId, question_text: `Question ${k} for Quiz ${quizId}`, quiz_id: quizId, question_type: 'multipleChoice' });

          // Add 4 answer choices for each question
          for (let l = 1; l <= 4; l++) {
            await answersStore.put({ id: answerId++, answer_text: `Answer ${l}`, correct: l === 1 ? 1 : 0, question_id: questionId });
          }

          questionId++;
        }

        quizId++;
      }
    }

    // Seed Student Enrollments and Quiz Scores
    for (let studentId = 2; studentId <= 21; studentId++) {
      for (const course of courses) {
        await studentsCoursesStore.put({ id: `${studentId}-${course.id}`, student_id: studentId, course_id: course.id });

        for (let moduleId = 1; moduleId <= 4; moduleId++) { // Assuming 4 modules per course
          for (let quizIndex = 1; quizIndex <= 20; quizIndex++) {
            const quizId = (moduleId - 1) * 20 + quizIndex;
            const correctAnswers = 5; // Assume student got all correct
            const score = 100; // Perfect score
            const questionResults = [];

            for (let q = 1; q <= 5; q++) {
              const questionId = ((quizId - 1) * 5) + q;
              questionResults.push({
                questionId,
                questionText: `Question ${q} for Quiz ${quizId}`,
                correctAnswer: `Answer 1`,
                studentAnswer: 1, // Assume the student chose the correct answer
                isCorrect: true,
              });
            }

            await scoresStore.put({
              student_id: studentId,
              quiz_id: quizId,
              score,
              submitted_at: new Date().toISOString(),
              questionResults,
            });
          }
        }
      }
    }

    await tx.done;
    console.log('Database fully seeded with quizzes, questions, and student results.');
  } catch (error) {
    console.error('Error seeding database with full quizzes:', error);
  }
};


const seedDatabase = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(
      ['users', 'courses', 'modules', 'assignments', 'quizzes', 'questions', 'answers', 'students_courses'],
      'readwrite'
    );

    // Seed Users (Teacher + 10 Students)
    const usersStore = tx.objectStore('users');
    await usersStore.put({ id: 1, username: 'teacher1', name: 'John Doe', email: 'johndoe@example.com', role: 'teacher' });
    await usersStore.put({ id: 2, username: 'student1', name: 'Jane Smith', email: 'janesmith@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 3, username: 'student2', name: 'Mike Johnson', email: 'mikejohnson@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 4, username: 'student3', name: 'Emily Davis', email: 'emilydavis@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 5, username: 'student4', name: 'David Wilson', email: 'davidwilson@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 6, username: 'student5', name: 'Sophia Brown', email: 'sophiabrown@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 7, username: 'student6', name: 'Chris Lee', email: 'chrislee@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 8, username: 'student7', name: 'Olivia Martin', email: 'oliviamartin@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 9, username: 'student8', name: 'James Taylor', email: 'jamestaylor@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 10, username: 'student9', name: 'Linda White', email: 'lindawhite@example.com', role: 'student', uniqueId: generateUniqueId() });
    await usersStore.put({ id: 11, username: 'student10', name: 'Ethan Brown', email: 'ethanbrown@example.com', role: 'student', uniqueId: generateUniqueId() });


    // Seed Courses
    const coursesStore = tx.objectStore('courses');
    await coursesStore.put({ id: 1, course_name: 'Physics 101', description: 'Introduction to basic physics concepts', teacher_id: 1 });
    await coursesStore.put({ id: 2, course_name: 'Mathematics 101', description: 'Introduction to basic mathematics concepts', teacher_id: 1 });
    await coursesStore.put({ id: 3, course_name: 'Chemistry 101', description: 'Introduction to basic chemistry concepts', teacher_id: 1 });
    await coursesStore.put({ id: 4, course_name: 'Biology 101', description: 'Introduction to basic biology concepts', teacher_id: 1 });
    await coursesStore.put({ id: 5, course_name: 'Computer Science 101', description: 'Introduction to basic programming concepts', teacher_id: 1 });

    // Seed Modules
    const modulesStore = tx.objectStore('modules');
    await modulesStore.put({ id: 1, module_name: 'Module 1: Basics of Motion', description: 'An introduction to the basics of motion', course_id: 1 });
    await modulesStore.put({ id: 2, module_name: 'Module 2: Energy and Work', description: 'Understanding energy and work', course_id: 1 });
    await modulesStore.put({ id: 3, module_name: 'Module 1: Algebra Fundamentals', description: 'Basic algebraic principles', course_id: 2 });
    await modulesStore.put({ id: 4, module_name: 'Module 2: Calculus Basics', description: 'Introduction to differentiation and integration', course_id: 2 });
    await modulesStore.put({ id: 5, module_name: 'Module 1: Atomic Structure', description: 'Learn about atoms and molecules', course_id: 3 });
    await modulesStore.put({ id: 6, module_name: 'Module 1: Cell Biology', description: 'The basics of cell structure and function', course_id: 4 });
    await modulesStore.put({ id: 7, module_name: 'Module 1: Introduction to Programming', description: 'Introduction to basic programming concepts', course_id: 5 });
    await modulesStore.put({ id: 8, module_name: 'Module 2: Advanced Programming', description: 'Deeper dive into algorithms and data structures', course_id: 5 });

    // Seed Assignments
    const assignmentsStore = tx.objectStore('assignments');
    await assignmentsStore.put({ id: 1, assignment_name: 'Assignment 1', module_id: 1, assignment_type: 'homework', grading_criteria: 'accuracy' });

    // Seed Quizzes with Questions and Answers
    const quizzesStore = tx.objectStore('quizzes');
    await quizzesStore.put({ id: 1, quiz_name: 'Quiz 1', description: 'Test your knowledge on basic motion', module_id: 1 });
    await quizzesStore.put({ id: 2, quiz_name: 'Quiz 2', description: 'Test your knowledge on energy and work', module_id: 2 });
    await quizzesStore.put({ id: 3, quiz_name: 'Quiz 1', description: 'Test your knowledge on algebra fundamentals', module_id: 3 });
    await quizzesStore.put({ id: 4, quiz_name: 'Basic Calculus Quiz', description: 'Test your calculus knowledge', module_id: 4 });
    await quizzesStore.put({ id: 5, quiz_name: 'Atomic Structure Quiz', description: 'Test your knowledge on atomic structures', module_id: 5 });
    await quizzesStore.put({ id: 6, quiz_name: 'Cell Biology Quiz', description: 'Test your knowledge on cell biology', module_id: 6 });
    await quizzesStore.put({ id: 7, quiz_name: 'Intro Programming Quiz', description: 'Test your basic programming knowledge', module_id: 7 });
    await quizzesStore.put({ id: 8, quiz_name: 'Advanced Programming Quiz', description: 'Test your advanced programming skills', module_id: 8 });

    // Seed Questions and Answers for Quizzes
    const questionsStore = tx.objectStore('questions');
    const answersStore = tx.objectStore('answers');

    // Add questions and answers for Quiz 1
    const question1Id = await questionsStore.add({ id: 1, question_text: 'What is the formula for velocity?', quiz_id: 1, question_type: 'multipleChoice' });
    await answersStore.put({ id: 1, answer_text: 'v = d/t', correct: 1, question_id: question1Id });
    await answersStore.put({ id: 2, answer_text: 'v = m*a', correct: 0, question_id: question1Id });
    await answersStore.put({ id: 3, answer_text: 'v = f/d', correct: 0, question_id: question1Id });

    const question2Id = await questionsStore.add({ id: 2, question_text: 'What is kinetic energy?', quiz_id: 2, question_type: 'multipleChoice' });
    await answersStore.put({ id: 4, answer_text: 'Energy of motion', correct: 1, question_id: question2Id });
    await answersStore.put({ id: 5, answer_text: 'Energy of position', correct: 0, question_id: question2Id });
    await answersStore.put({ id: 6, answer_text: 'Energy of heat', correct: 0, question_id: question2Id });

    const question3Id = await questionsStore.add({ id: 3, question_text: 'Solve x^2 - 4 = 0.', quiz_id: 3, question_type: 'textAnswer' });
    await answersStore.put({ id: 7, answer_text: 'x = ±2', correct: 1, question_id: question3Id });

    const question4Id = await questionsStore.add({ id: 4, question_text: 'What is the derivative of x^2?', quiz_id: 4, question_type: 'multipleChoice' });
    await answersStore.put({ id: 8, answer_text: '2x', correct: 1, question_id: question4Id });
    await answersStore.put({ id: 9, answer_text: 'x', correct: 0, question_id: question4Id });

    const question5Id = await questionsStore.add({ id: 5, question_text: 'What particles are in the nucleus?', quiz_id: 5, question_type: 'multipleChoice' });
    await answersStore.put({ id: 10, answer_text: 'Protons and Neutrons', correct: 1, question_id: question5Id });
    await answersStore.put({ id: 11, answer_text: 'Electrons', correct: 0, question_id: question5Id });

    const question6Id = await questionsStore.add({ id: 6, question_text: 'Name the powerhouse of the cell.', quiz_id: 6, question_type: 'textAnswer' });
    await answersStore.put({ id: 12, answer_text: 'Mitochondria', correct: 1, question_id: question6Id });

    const question7Id = await questionsStore.add({ id: 7, question_text: 'What is a variable?', quiz_id: 7, question_type: 'multipleChoice' });
    await answersStore.put({ id: 13, answer_text: 'A placeholder for data', correct: 1, question_id: question7Id });
    await answersStore.put({ id: 14, answer_text: 'A constant value', correct: 0, question_id: question7Id });

    const question8Id = await questionsStore.add({ id: 8, question_text: 'Which sorting algorithm is the fastest?', quiz_id: 8, question_type: 'multipleChoice' });
    await answersStore.put({ id: 15, answer_text: 'Quick Sort', correct: 1, question_id: question8Id });
    await answersStore.put({ id: 16, answer_text: 'Bubble Sort', correct: 0, question_id: question8Id });

    // Seed Student Enrollments with more coverage
    const studentsCoursesStore = tx.objectStore('students_courses');
    await studentsCoursesStore.put({ id: 1, student_id: 2, course_id: 1 });
    await studentsCoursesStore.put({ id: 2, student_id: 3, course_id: 1 });
    await studentsCoursesStore.put({ id: 3, student_id: 4, course_id: 1 });
    await studentsCoursesStore.put({ id: 4, student_id: 5, course_id: 1 });
    await studentsCoursesStore.put({ id: 5, student_id: 6, course_id: 1 });
    await studentsCoursesStore.put({ id: 6, student_id: 7, course_id: 2 });
    await studentsCoursesStore.put({ id: 7, student_id: 8, course_id: 2 });
    await studentsCoursesStore.put({ id: 8, student_id: 9, course_id: 2 });
    await studentsCoursesStore.put({ id: 9, student_id: 10, course_id: 2 });
    await studentsCoursesStore.put({ id: 10, student_id: 11, course_id: 2 });
    await studentsCoursesStore.put({ id: 11, student_id: 2, course_id: 3 });
    await studentsCoursesStore.put({ id: 12, student_id: 3, course_id: 3 });
    await studentsCoursesStore.put({ id: 13, student_id: 4, course_id: 3 });
    await studentsCoursesStore.put({ id: 14, student_id: 5, course_id: 3 });
    await studentsCoursesStore.put({ id: 15, student_id: 6, course_id: 4 });
    await studentsCoursesStore.put({ id: 16, student_id: 7, course_id: 4 });
    await studentsCoursesStore.put({ id: 17, student_id: 8, course_id: 4 });
    await studentsCoursesStore.put({ id: 18, student_id: 9, course_id: 5 });
    await studentsCoursesStore.put({ id: 19, student_id: 10, course_id: 5 });
    await studentsCoursesStore.put({ id: 20, student_id: 11, course_id: 5 });

    await tx.done;
    console.log('Database seeded with more detailed data.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};



// Initialize and seed the database
// await clearDatabase(); // Clears existing data to ensure stores are created fresh
// if database is empty, seed it with initial data
// if ((await openDB('lmsDatabase3', 1)).objectStoreNames.length === 0) {
//   await seedDatabase();
// }
// await seedDatabase(); // Seeds initial data
// await seedDatabaseWithFullQuizzes();
// Function to fetch quizzes by module ID
const fetchQuizzesByModuleId = async (moduleId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('quizzes', 'readonly');
    const store = tx.objectStore('quizzes');
    const allQuizzes = await store.getAll();
    console.log('Fetched quizzes:', allQuizzes); // Debug: Log fetched quizzes
    return allQuizzes.filter((quiz) => quiz.module_id === Number(moduleId));
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

// const fetchQuizzesByStudentInCourse = async (courseId, studentId) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction(['quizzes', 'student_quiz_scores'], 'readonly');
//     const quizzesStore = tx.objectStore('quizzes');
//     const scoresStore = tx.objectStore('student_quiz_scores');
    
//     const allQuizzes = await quizzesStore.getAll();
//     const allScores = await scoresStore.getAll();

//     const quizzesTaken = allScores.filter((score) => score.student_id === studentId);
//     const quizzesData = quizzesTaken.map((quiz) => {
//       const quizInfo = allQuizzes.find((q) => q.id === quiz.quiz_id);
//       return { ...quizInfo, score: quiz.score };
//     });

//     console.log('Fetched quizzes:', quizzesData);
//     return quizzesData;
//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     return [];
//   }
// };

const fetchQuizzesByStudentInCourse = async (courseId, studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['quizzes', 'modules', 'student_quiz_scores'], 'readonly');
    const quizzesStore = tx.objectStore('quizzes');
    const modulesStore = tx.objectStore('modules');
    const scoresStore = tx.objectStore('student_quiz_scores');

    console.log('Fetching quizzes for student:', studentId, 'in course:', courseId);

    // Fetch all modules related to the course
    const allModules = await modulesStore.getAll();
    const courseModules = allModules.filter(module => module.course_id === courseId);
    const moduleIds = courseModules.map(module => module.id);

    // Fetch all quizzes related to the course modules
    const allQuizzes = await quizzesStore.getAll();
    const courseQuizzes = allQuizzes.filter(quiz => moduleIds.includes(quiz.module_id));

    console.log('Quizzes for course:', courseQuizzes);

    // Fetch all scores related to the student
    const allScores = await scoresStore.getAll();
    const studentScores = allScores.filter(score => score.student_id === studentId);

    // Map the quizzes to include the student's score
    const quizzesData = courseQuizzes.map(quiz => {
      const studentScore = studentScores.find(score => score.quiz_id === quiz.id);
      return { ...quiz, score: studentScore ? studentScore.score : null };
    });

    console.log('Fetched quizzes with student scores:', quizzesData);
    return quizzesData;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};



// Function to add questions and answers to a quiz
const addQuestionsToQuiz = async (quizId, questions, db) => {
  try {
    // Use the provided transaction from the parent function, ensuring it remains open
    const tx = db.transaction(['questions', 'answers'], 'readwrite');
    const questionsStore = tx.objectStore('questions');

    for (const question of questions) {
      const questionData = {
        question_text: question.text,
        quiz_id: quizId,
        question_type: question.type,
      };
      const questionId = await questionsStore.add(questionData);

      // Add answers associated with each question
      await addAnswersToQuestion(questionId, question.options, tx);
    }

    await tx.done; // Await tx.done at the end after all operations are complete
    console.log('Questions successfully added.');
  } catch (error) {
    console.error('Error adding questions:', error);
  }
};

// Function to add answers to a question
const addAnswersToQuestion = async (questionId, options, tx) => {
  if (!Array.isArray(options)) {
    console.error('Options is not iterable:', options);
    return;
  }

  try {
    const store = tx.objectStore('answers');

    for (const option of options) {
      const newAnswer = {
        answer_text: option.text,
        correct: option.correct ? 1 : 0,
        question_id: questionId,
      };
      await store.add(newAnswer);
    }

    console.log('Answers successfully added.');
  } catch (error) {
    console.error('Error adding answers:', error);
  }
};

// Updated function to add a quiz to a module
// const addQuizToModule = async (moduleId, quizTitle, quizDescription, questions = []) => {
//   const db = await initDB();
//   const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readwrite'); // Transaction for all related stores
//   const quizzesStore = tx.objectStore('quizzes');
  
//   try {
//     const newQuiz = {
//       quiz_name: quizTitle,
//       description: quizDescription,
//       module_id: moduleId,
//     };
//     const quizId = await quizzesStore.add(newQuiz);

//     // Add questions and answers to the quiz within the same transaction
//     await addQuestionsToQuiz(quizId, questions, db);

//     await tx.done; // Await tx.done after all operations are complete
//     console.log('Quiz successfully added:', { ...newQuiz, id: quizId });
//     return { ...newQuiz, id: quizId };
//   } catch (error) {
//     console.error('Error adding quiz:', error);
//     await tx.abort(); // Abort transaction if there's an error
//     throw error; // Rethrow the error to be handled by calling function
//   }
// };

// Updated function to add a quiz to a module
const addQuizToModule = async (moduleId, quizTitle, quizDescription, questions = [], dueDate = null, quizLength = null) => {
  const db = await initDB();
  const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readwrite'); // Transaction for all related stores
  const quizzesStore = tx.objectStore('quizzes');
  
  try {
    const newQuiz = {
      quiz_name: quizTitle,
      description: quizDescription,
      module_id: moduleId,
      due_date: dueDate ? new Date(dueDate).toISOString() : null, // Store due date as ISO string
      quiz_length: quizLength, // Store quiz length in minutes
    };
    const quizId = await quizzesStore.add(newQuiz);

    // Add questions and answers to the quiz within the same transaction
    await addQuestionsToQuiz(quizId, questions, db);

    await tx.done; // Await tx.done after all operations are complete
    console.log('Quiz successfully added:', { ...newQuiz, id: quizId });
    return { ...newQuiz, id: quizId };
  } catch (error) {
    console.error('Error adding quiz:', error);
    await tx.abort(); // Abort transaction if there's an error
    throw error; // Rethrow the error to be handled by calling function
  }
};



const validateTeacherLogin = async (username) => {
  try {
    const db = await initDB();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const allUsers = await store.getAll();
    const user = allUsers.find(
      (user) => user.username === username && user.role === 'teacher'
    );

    return user ? user : null;
  } catch (error) {
    console.error('Error validating teacher login:', error);
    return null;
  }
};

// Example implementation of fetchCoursesByTeacherId
const fetchCoursesByTeacherId = async (teacherId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('courses', 'readonly');
    const store = tx.objectStore('courses');
    const allCourses = await store.getAll();
    // Filter courses by the teacher's ID
    return allCourses.filter((course) => course.teacher_id === teacherId);
  } catch (error) {
    console.error('Error fetching courses by teacher ID:', error);
    return [];
  }
};

const fetchModulesByCourseId = async (courseId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('modules', 'readonly');
    const store = tx.objectStore('modules');
    const allModules = await store.getAll();
    return allModules.filter((module) => module.course_id === courseId);
  } catch (error) {
    console.error('Error fetching modules by course ID:', error);
    return [];
  }
}

const fetchAssignmentsByModuleId = async (courseId, moduleId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('assignments', 'readonly');
    const store = tx.objectStore('assignments');
    const allAssignments = await store.getAll();
    return allAssignments.filter((assignment) => assignment.module_id === moduleId);
  } catch (error) {
    console.error('Error fetching assignments by module ID:', error);
    return [];
  }
}

const fetchStudentsByCourseId = async (courseId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('students_courses', 'readonly');
    const store = tx.objectStore('students_courses');
    const allEnrollments = await store.getAll();
    
    console.log('Enrollments:', allEnrollments); // Debugging: Log enrollments data
    
    // Filter enrollments to find students for the specified course
    const studentIds = allEnrollments
      .filter((enrollment) => enrollment.course_id === courseId)
      .map((enrollment) => enrollment.student_id);
    
    console.log('Student IDs:', studentIds); // Debugging: Log student IDs

    const studentsStore = db.transaction('users', 'readonly').objectStore('users');
    const students = await Promise.all(
      studentIds.map(async (studentId) => await studentsStore.get(studentId))
    );

    console.log('Fetched Students:', students); // Debugging: Log fetched students
    return students;
  } catch (error) {
    console.error('Error fetching students by course ID:', error);
    return [];
  }
};


const addCourse = async (courseName, description, teacherId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('courses', 'readwrite');
    const store = tx.objectStore('courses');
    const newCourse = {
      course_name: courseName,
      description,
      teacher_id: teacherId,
    };
    const courseId = await store.add(newCourse);
    await tx.done;
    return { ...newCourse, id: courseId };
  } catch (error) {
    console.error('Error adding course:', error);
  }
}

const addModule = async (courseId, moduleName, description) => {
  try {
    const db = await initDB();
    const tx = db.transaction('modules', 'readwrite');
    const store = tx.objectStore('modules');
    const newModule = {
      module_name: moduleName,
      description,
      course_id: courseId,
    };
    const moduleId = await store.add(newModule);
    await tx.done;
    return { ...newModule, id: moduleId };
  } catch (error) {
    console.error('Error adding module:', error);
  }
}


const fetchModuleById = async (moduleId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('modules', 'readonly');
    const store = tx.objectStore('modules');
    return await store.get(moduleId);
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    return null;
  }
}


const fetchQuizById = async (quizId) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readonly');
    const quizzesStore = tx.objectStore('quizzes');
    const quiz = await quizzesStore.get(Number(quizId));
    if (!quiz) throw new Error('Quiz not found');

    // Fetch questions associated with the quiz
    const questionsStore = tx.objectStore('questions');
    const allQuestions = await questionsStore.getAll();
    quiz.questions = allQuestions.filter(q => q.quiz_id === Number(quizId));

    // Fetch options for each question
    const answersStore = tx.objectStore('answers');
    for (const question of quiz.questions) {
      question.options = await answersStore.getAll();
      question.options = question.options.filter(option => option.question_id === question.id);
    }

    return quiz;
  } catch (error) {
    console.error('Error fetching quiz:', error);
    throw error;
  }
};



const submitQuiz = async (quizId, studentId, answers) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['quizzes', 'questions', 'answers', 'student_quiz_scores'], 'readwrite');
    const quizzesStore = tx.objectStore('quizzes');
    const questionsStore = tx.objectStore('questions');
    const answersStore = tx.objectStore('answers');
    const scoresStore = tx.objectStore('student_quiz_scores');

    // Fetch the quiz
    const quiz = await quizzesStore.get(Number(quizId));
    if (!quiz) throw new Error('Quiz not found');

    // Fetch questions associated with the quiz
    const allQuestions = await questionsStore.getAll();
    const quizQuestions = allQuestions.filter((q) => q.quiz_id === Number(quizId));

    let totalQuestions = quizQuestions.length;
    let correctAnswers = 0;
    const questionResults = [];

    // Grade the quiz
    for (const question of quizQuestions) {
      const userAnswer = answers[question.id]; // Fetch the answer based on the question ID
      const questionAnswers = await answersStore.getAll();
      const correctAnswer = questionAnswers.find(
        (ans) => ans.question_id === question.id && ans.correct === 1
      );

      let isCorrect = false;

      // For multiple choice questions, compare the selected index
      if (question.question_type === 'multipleChoice') {
        isCorrect = userAnswer !== undefined && correctAnswer && correctAnswer.id === userAnswer;
      } 
      // For text answers, check for exact match
      else if (question.question_type === 'textAnswer') {
        isCorrect = userAnswer && correctAnswer && userAnswer.toLowerCase().trim() === correctAnswer.answer_text.toLowerCase().trim();
      }

      // Increment correct answers count
      if (isCorrect) {
        correctAnswers++;
      }

      // Save question results, including the student's answer
      questionResults.push({
        questionId: question.id,
        questionText: question.question_text,
        correctAnswer: correctAnswer?.answer_text,
        studentAnswer: userAnswer !== undefined ? userAnswer : 'No Answer Provided', // Handle undefined answers
        isCorrect,
      });
    }

    // Calculate the overall score
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    // Save the overall result and individual question results in the student_quiz_scores table
    const result = {
      student_id: Number(studentId),
      quiz_id: Number(quizId),
      score,
      submitted_at: new Date().toISOString(),
      questionResults,
    };

    await scoresStore.add(result);
    await tx.done;

    // Return the graded result
    return {
      score,
      correctAnswers,
      totalQuestions,
      questionResults,
      message: `You scored ${score}% with ${correctAnswers} out of ${totalQuestions} correct answers.`,
    };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};



const fetchStudentQuizResults = async (quizId, studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('student_quiz_scores', 'readonly');
    const scoresStore = tx.objectStore('student_quiz_scores');

    // Fetch all quiz results
    const allResults = await scoresStore.getAll();

    // Find the specific result for the given quiz and student
    const studentResult = allResults.find(
      (result) => result.quiz_id === Number(quizId) && result.student_id === Number(studentId)
    );
    console.log('Fetched student quiz results:', studentResult); // Debug: Log fetched student quiz results
    return studentResult || null; // Return null if not found instead of throwing an error
  } catch (error) {
    console.error('Error fetching student quiz results:', error);
    return null;
  }
};

// const fetchStudentQuizResults = async (quizId, studentId) => {
//   console.log('Fetching student quiz results...');
//   try {
//     console.log('Fetching student quiz results...');
//     const db = await initDB();
//     const tx = db.transaction('student_quiz_scores', 'readonly');
//     const scoresStore = tx.objectStore('student_quiz_scores');

//     // Fetch all quiz results
//     const allResults = await scoresStore.getAll();

//     // Find the specific result for the given quiz and student
//     const studentResult = allResults.find(
//       (result) => result.quiz_id === Number(quizId) && result.student_id === Number(studentId)
//     );

//     // Log the fetched result for debugging
//     console.log('Fetched student quiz results:', studentResult);

//     // Return the result, or an empty object if undefined
//     return studentResult || null;
//   } catch (error) {
//     console.error('Error fetching student quiz results:', error);
//     return null;
//   }
// };


const fetchStudentByName = async (studentName) => {
  try {
    const db = await initDB();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const allStudents = await store.getAll();

    // Find the first student with the matching name
    const student = allStudents.find((student) => student.name === studentName);

    if (!student) {
      throw new Error('Student not found.');
    }

    return student.id; // Return the student's ID instead of the entire object
  } catch (error) {
    console.error('Error fetching student by name:', error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

const fetchStudentByUniqueId = async (uniqueId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    const allStudents = await store.getAll();

    const student = allStudents.find((student) => student.uniqueId === uniqueId);

    if (!student) {
      throw new Error('Student not found.');
    }

    return student; // Return the student object
  } catch (error) {
    console.error('Error fetching student by unique ID:', error);
    throw error;
  }
};

const fetchStudentById = async (studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('users', 'readonly');
    const store = tx.objectStore('users');
    return await store.get(studentId);
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
}

const fetchCoursesByStudentId = async (studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('students_courses', 'readonly');
    const store = tx.objectStore('students_courses');
    const allEnrollments = await store.getAll();

    // Filter enrollments to find courses for the specified student
    const courseIds = allEnrollments
      .filter((enrollment) => enrollment.student_id === studentId)
      .map((enrollment) => enrollment.course_id);

    // Fetch course details
    const coursesStore = db.transaction('courses', 'readonly').objectStore('courses');
    const courses = await Promise.all(
      courseIds.map(async (courseId) => await coursesStore.get(courseId))
    );

    return courses.filter(course => course !== undefined); // Return only valid courses
  } catch (error) {
    console.error('Error fetching courses by student ID:', error);
    return [];
  }
};

export const fetchResultsByQuizId = async (quizId) => {
  try {
    const db = await initDB();  // Initialize the database
    const tx = db.transaction('student_quiz_scores', 'readonly');  // Open a read-only transaction
    const store = tx.objectStore('student_quiz_scores');  // Access the `student_quiz_scores` store
    const allResults = await store.getAll();  // Get all results

    // Filter the results to find those that match the given quizId
    const results = allResults.filter(result => result.quiz_id === quizId);

    return results;  // Return the filtered results
  } catch (error) {
    console.error('Error fetching results by quiz ID:', error);
    return [];  // Return an empty array in case of error
  }
};


export const fetchResultsByAssignmentId = async (assignmentId) => {
  try {
    const db = await initDB();  // Initialize the database
    const tx = db.transaction('assignments', 'readonly');  // Open a read-only transaction
    const store = tx.objectStore('assignments');  // Access the `assignments` store
    const allResults = await store.getAll();  // Get all results

    // Filter the results to find those that match the given assignmentId
    const results = allResults.filter(result => result.assignment_id === assignmentId);

    return results;  // Return the filtered results
  } catch (error) {
    console.error('Error fetching results by assignment ID:', error);
    return [];  // Return an empty array in case of error
  }
};

const fetchTasks = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const allTasks = await store.getAll();
    return allTasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

const addTask = async (task) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const taskId = await store.add({
      ...task,
      created_at: new Date().toISOString(),
    });
    await tx.done;
    return { ...task, id: taskId };
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

const deleteTask = async (taskId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    await store.delete(taskId);
    await tx.done;
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

const updateTask = async (taskId, updates) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readwrite');
    const store = tx.objectStore('tasks');
    const existingTask = await store.get(taskId);

    if (existingTask) {
      const updatedTask = { ...existingTask, ...updates, updated_at: new Date().toISOString() };
      await store.put(updatedTask);
      await tx.done;
      return updatedTask;
    } else {
      console.error('Task not found:', taskId);
      return null;
    }
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const fetchTaskById = async (taskId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    return await store.get(taskId);
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return null;
  }
};


const fetchTasksByType = async (taskType) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const allTasks = await store.getAll();
    return allTasks.filter(task => task.type === taskType);
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    return [];
  }
};

const updateQuizInModule = async (quizId, updatedQuiz) => {
  const db = await initDB();
  const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readwrite');
  const quizzesStore = tx.objectStore('quizzes');

  try {
    const existingQuiz = await quizzesStore.get(quizId);
    if (!existingQuiz) {
      throw new Error(`Quiz with ID ${quizId} not found.`);
    }

    const updatedQuizData = {
      ...existingQuiz,
      quiz_name: updatedQuiz.quizTitle,
      description: updatedQuiz.quizDescription,
      startDate: updatedQuiz.startDate ? new Date(updatedQuiz.startDate).toISOString() : null,
      dueDate: updatedQuiz.dueDate ? new Date(updatedQuiz.dueDate).toISOString() : null,
      quiz_length: updatedQuiz.quizLength,
    };

    await quizzesStore.put(updatedQuizData);

    // Clear existing questions and answers
    const questionsStore = tx.objectStore('questions');
    const answersStore = tx.objectStore('answers');
    const existingQuestions = await questionsStore.getAll();
    const quizQuestions = existingQuestions.filter((q) => q.quiz_id === quizId);

    for (const question of quizQuestions) {
      const existingAnswers = await answersStore.getAll();
      const questionAnswers = existingAnswers.filter((a) => a.question_id === question.id);
      for (const answer of questionAnswers) {
        await answersStore.delete(answer.id);
      }
      await questionsStore.delete(question.id);
    }

    // Add new questions and answers
    await addQuestionsToQuiz(quizId, updatedQuiz.questions, db);

    await tx.done;
    console.log('Quiz successfully updated:', updatedQuizData);
    return updatedQuizData;
  } catch (error) {
    console.error('Error updating quiz:', error);
    await tx.abort();
    throw error;
  }
};

const fetchTasksByModuleId = async (moduleId) => {
  try {
    const db = await initDB();
    const tx = db.transaction('tasks', 'readonly');
    const store = tx.objectStore('tasks');
    const allTasks = await store.getAll();
    return allTasks.filter((task) => task.module_id === moduleId);
  } catch (error) {
    console.error('Error fetching tasks by module ID:', error);
    return [];
  }
};


export const fetchTasksByCourseId = async (courseId, studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['tasks', 'quizzes'], 'readonly');
    const tasksStore = tx.objectStore('tasks');
    const quizzesStore = tx.objectStore('quizzes');
    
    // Fetch all tasks related to the course
    const allTasks = await tasksStore.getAll();
    const courseTasks = allTasks.filter(task => task.course_id === courseId);
    
    // Fetch all quizzes related to the course
    const allQuizzes = await quizzesStore.getAll();
    const courseQuizzes = allQuizzes.filter(quiz => quiz.course_id === courseId && quiz.student_id === studentId);

    return {
      tasks: courseTasks,
      quizzes: courseQuizzes,
    };
  } catch (error) {
    console.error('Error fetching tasks and quizzes by course ID:', error);
    return {
      tasks: [],
      quizzes: [],
    };
  }
};


export {
  validateTeacherLogin,
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchAssignmentsByModuleId,
  fetchQuizzesByModuleId,
  fetchStudentsByCourseId,
  addCourse,
  addModule,
  addQuizToModule,
  fetchModuleById,
  fetchQuizById,
  submitQuiz,
  fetchStudentQuizResults,
  fetchStudentByName,
  fetchStudentByUniqueId,
  fetchQuizzesByStudentInCourse,
  fetchStudentById,
  fetchCoursesByStudentId,
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
  fetchTaskById,
  fetchTasksByType,
  updateQuizInModule,
  fetchTasksByModuleId,


};
