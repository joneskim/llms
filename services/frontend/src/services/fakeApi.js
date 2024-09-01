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
    const db = await openDB('lmsDatabase3', 1, {
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

const fetchQuizzesByStudentInCourse = async (courseId, studentId) => {
  try {
    const db = await initDB();
    const tx = db.transaction(['quizzes', 'student_quiz_scores'], 'readonly');
    const quizzesStore = tx.objectStore('quizzes');
    const scoresStore = tx.objectStore('student_quiz_scores');
    
    const allQuizzes = await quizzesStore.getAll();
    const allScores = await scoresStore.getAll();

    const quizzesTaken = allScores.filter((score) => score.student_id === studentId);
    const quizzesData = quizzesTaken.map((quiz) => {
      const quizInfo = allQuizzes.find((q) => q.id === quiz.quiz_id);
      return { ...quizInfo, score: quiz.score };
    });

    console.log('Fetched quizzes:', quizzesData);
    return quizzesData;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return [];
  }
};

// Function to add a quiz to a module
// const addQuizToModule = async (moduleId, quizTitle, questions = []) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readwrite');
//     const quizzesStore = tx.objectStore('quizzes');
//     const newQuiz = {
//       quiz_name: quizTitle,
//       description: '',
//       module_id: moduleId,
//     };
//     const quizId = await quizzesStore.add(newQuiz);
//     console.log('Added quiz:', { ...newQuiz, id: quizId }); // Debug: Log the added quiz

//     // Add questions and answers to the quiz
//     await addQuestionsToQuiz(quizId, questions);

//     await tx.done;
//     return { ...newQuiz, id: quizId };
//   } catch (error) {
//     console.error('Error adding quiz:', error);
//   }
// };
// const addQuizToModule = async (moduleId, quizTitle, quizDescription, questions = []) => {
//   const db = await initDB();
//   const tx = db.transaction('quizzes', 'readwrite');
//   const quizzesStore = tx.objectStore('quizzes');
//   const newQuiz = {
//     quiz_name: quizTitle,
//     description: quizDescription, // Store the description
//     module_id: moduleId,
//   };
//   const quizId = await quizzesStore.add(newQuiz);
//   await tx.done;

//   await addQuestionsToQuiz(quizId, questions);

//   console.log('Quiz successfully added:', { ...newQuiz, id: quizId });
//   return { ...newQuiz, id: quizId };
// };



// // Function to add questions and answers to a quiz
// const addQuestionsToQuiz = async (quizId, questions) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction('questions', 'readwrite');
//     const questionsStore = tx.objectStore('questions');

//     for (const question of questions) {
//       const questionData = {
//         question_text: question.text,
//         quiz_id: quizId,
//         question_type: question.type,
//       };
//       const questionId = await questionsStore.add(questionData);

//       // Add answers associated with each question
//       await addAnswersToQuestion(questionId, question.options);
//     }

//     await tx.done;
//     console.log('Questions successfully added.');
//   } catch (error) {
//     console.error('Error adding questions:', error);
//   }
// };

// // Function to add answers to a question
// const addAnswersToQuestion = async (questionId, options) => {
//   if (!Array.isArray(options)) {
//     console.error('Options is not iterable:', options);
//     return;
//   }

//   try {
//     const db = await initDB();
//     const tx = db.transaction('answers', 'readwrite');
//     const store = tx.objectStore('answers');

//     for (const option of options) {
//       const newAnswer = {
//         answer_text: option.text,
//         correct: option.correct ? 1 : 0,
//         question_id: questionId,
//       };
//       await store.add(newAnswer);
//     }

//     await tx.done;
//     console.log('Answers successfully added.');
//   } catch (error) {
//     console.error('Error adding answers:', error);
//   }
// };

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
const addQuizToModule = async (moduleId, quizTitle, quizDescription, questions = []) => {
  const db = await initDB();
  const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readwrite'); // Transaction for all related stores
  const quizzesStore = tx.objectStore('quizzes');
  
  try {
    const newQuiz = {
      quiz_name: quizTitle,
      description: quizDescription,
      module_id: moduleId,
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


// Example implementation of validateTeacherLogin
// const validateTeacherLogin = async (username, password) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction('users', 'readonly');
//     const store = tx.objectStore('users');
//     const allUsers = await store.getAll();

//     // Find the user with the matching username and role
//     const user = allUsers.find(
//       (user) => user.username === username && user.role === 'teacher'
//     );

//     // Validate password
//     if (user && user.password === password) {
//       return user; // Return the user if the username, role, and password match
//     } else {
//       console.warn('Invalid credentials provided');
//       return null; // Return null if credentials don't match
//     }
//   } catch (error) {
//     console.error('Error validating teacher login:', error);
//     return null;
//   }
// };

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

// Updated function to fetch a quiz by its ID along with its questions and options
// const fetchQuizById = async (quizId) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction(['quizzes', 'questions', 'answers'], 'readonly');
//     const quizzesStore = tx.objectStore('quizzes');
//     const quiz = await quizzesStore.get(Number(quizId));

//     if (!quiz) throw new Error('Quiz not found');

//     // Fetch questions associated with the quiz
//     const questionsStore = tx.objectStore('questions');
//     const allQuestions = await questionsStore.getAll();
//     quiz.questions = allQuestions.filter((q) => q.quiz_id === Number(quizId));

//     // Fetch answers associated with each question
//     const answersStore = tx.objectStore('answers');
//     const allAnswers = await answersStore.getAll();

//     // Attach options (answers) to each question
//     quiz.questions = quiz.questions.map((question) => {
//       question.options = allAnswers.filter((answer) => answer.question_id === question.id);
//       return question;
//     });

//     console.log('Fetched quiz:', quiz);

//     await tx.done;
//     return quiz;
//   } catch (error) {
//     console.error('Error fetching quiz:', error);
//     throw error;
//   }
// };


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


// // Function to submit a quiz and grade it
// const submitQuiz = async (quizId, studentId, answers) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction(['quizzes', 'questions', 'answers', 'student_quiz_scores'], 'readwrite');
//     const quizzesStore = tx.objectStore('quizzes');
//     const questionsStore = tx.objectStore('questions');
//     const answersStore = tx.objectStore('answers');
//     const scoresStore = tx.objectStore('student_quiz_scores');

//     // Fetch the quiz
//     const quiz = await quizzesStore.get(Number(quizId));
//     if (!quiz) throw new Error('Quiz not found');

//     // Fetch questions associated with the quiz
//     const allQuestions = await questionsStore.getAll();
//     const quizQuestions = allQuestions.filter((q) => q.quiz_id === Number(quizId));

//     let totalQuestions = quizQuestions.length;
//     let correctAnswers = 0;
//     const questionResults = [];

//     // Grade the quiz
//     for (const question of quizQuestions) {
//       const userAnswer = answers[question.id];
//       const questionAnswers = await answersStore.getAll();
//       const correctAnswer = questionAnswers.find(
//         (ans) => ans.question_id === question.id && ans.correct === 1
//       );

//       let isCorrect = false;
//       // For multiple choice questions, compare the selected index
//       if (question.question_type === 'multipleChoice') {
//         isCorrect = userAnswer !== undefined && correctAnswer && correctAnswer.id === userAnswer;
//       }
//       // For text answers, check for exact match
//       else if (question.question_type === 'textAnswer') {
//         isCorrect =
//           userAnswer &&
//           correctAnswer &&
//           userAnswer.toLowerCase().trim() === correctAnswer.answer_text.toLowerCase().trim();
//       }

//       if (isCorrect) {
//         correctAnswers++;
//       }

//       // Store individual question results
//       questionResults.push({
//         questionId: question.id,
//         questionText: question.question_text,
//         correctAnswer: correctAnswer?.answer_text,
//         studentAnswer: userAnswer,
//         isCorrect,
//       });
//     }

//     // Calculate the overall score
//     const score = Math.round((correctAnswers / totalQuestions) * 100);

//     // Save the overall result and individual question results in the student_quiz_scores table
//     const result = {
//       student_id: Number(studentId),
//       quiz_id: Number(quizId),
//       score,
//       submitted_at: new Date().toISOString(),
//       questionResults,
//     };

//     await scoresStore.add(result);
//     await tx.done;

//     // Return the graded result
//     return {
//       score,
//       correctAnswers,
//       totalQuestions,
//       questionResults,
//       message: `You scored ${score}% with ${correctAnswers} out of ${totalQuestions} correct answers.`,
//     };
//   } catch (error) {
//     console.error('Error submitting quiz:', error);
//     throw error;
//   }
// };


// // Function to submit a quiz and grade it, storing detailed results for each question
// const submitQuiz = async (quizId, studentId, answers) => {
//   try {
//     const db = await initDB();
//     const tx = db.transaction(['quizzes', 'questions', 'answers', 'student_quiz_scores'], 'readwrite');
//     const quizzesStore = tx.objectStore('quizzes');
//     const questionsStore = tx.objectStore('questions');
//     const answersStore = tx.objectStore('answers');
//     const scoresStore = tx.objectStore('student_quiz_scores');

//     // Fetch the quiz
//     const quiz = await quizzesStore.get(Number(quizId));
//     if (!quiz) throw new Error('Quiz not found');

//     // Fetch questions associated with the quiz
//     const allQuestions = await questionsStore.getAll();
//     const quizQuestions = allQuestions.filter((q) => q.quiz_id === Number(quizId));

//     let totalQuestions = quizQuestions.length;
//     let correctAnswers = 0;
//     const questionResults = [];

//     // Grade the quiz
//     for (const question of quizQuestions) {
//       const userAnswer = answers[question.id];
//       const questionAnswers = await answersStore.getAll();
//       const correctAnswer = questionAnswers.find(
//         (ans) => ans.question_id === question.id && ans.correct === 1
//       );

//       let isCorrect = false;
//       // For multiple choice questions, compare the selected index
//       if (question.question_type === 'multipleChoice') {
//         isCorrect = userAnswer !== undefined && correctAnswer && correctAnswer.id === userAnswer;
//       }
//       // For text answers, check for exact match
//       else if (question.question_type === 'textAnswer') {
//         isCorrect =
//           userAnswer &&
//           correctAnswer &&
//           userAnswer.toLowerCase().trim() === correctAnswer.answer_text.toLowerCase().trim();
//       }

//       if (isCorrect) {
//         correctAnswers++;
//       }

//       // Store individual question results
//       questionResults.push({
//         questionId: question.id,
//         questionText: question.question_text,
//         correctAnswer: correctAnswer?.answer_text,
//         studentAnswer: userAnswer,
//         isCorrect,
//       });
//     }

//     // Calculate the overall score
//     const score = Math.round((correctAnswers / totalQuestions) * 100);

//     // Save the overall result and individual question results in the student_quiz_scores table
//     const result = {
//       student_id: Number(studentId),
//       quiz_id: Number(quizId),
//       score,
//       submitted_at: new Date().toISOString(),
//       questionResults,
//     };

//     await scoresStore.add(result);
//     await tx.done;

//     // Return the graded result
//     return {
//       score,
//       correctAnswers,
//       totalQuestions,
//       questionResults,
//       message: `You scored ${score}% with ${correctAnswers} out of ${totalQuestions} correct answers.`,
//     };
//   } catch (error) {
//     console.error('Error submitting quiz:', error);
//     throw error;
//   }
// };

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
};
