import { openDB } from 'idb';

// Initialize IndexedDB database and create object stores
const initDB = async () => {
  try {
    const db = await openDB('lmsDatabase1', 1, {
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

// Seed initial data into the database
const seedDatabase = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction(
      ['users', 'courses', 'modules', 'assignments', 'quizzes'],
      'readwrite'
    );

    // Seed Users
    const usersStore = tx.objectStore('users');
    await usersStore.put({
      id: 1,
      username: 'teacher1',
      name: 'John Doe',
      email: 'johndoe@example.com',
      role: 'teacher',
    });
    await usersStore.put({
      id: 2,
      username: 'student1',
      name: 'Jane Smith',
      email: 'janesmith@example.com',
      role: 'student',
    });
    await usersStore.put({
      id: 3,
      username: 'student2',
      name: 'Mike Johnson',
      email: 'mikejohnson@example.com',
      role: 'student',
    });

    // Seed Courses
    const coursesStore = tx.objectStore('courses');
    await coursesStore.put({
      id: 1,
      course_name: 'Physics 101',
      description: 'Introduction to basic physics concepts',
      teacher_id: 1,
    });
    await coursesStore.put({
      id: 2,
      course_name: 'Mathematics 101',
      description: 'Introduction to basic mathematics concepts',
      teacher_id: 1,
    });

    // Seed Modules
    const modulesStore = tx.objectStore('modules');
    await modulesStore.put({
      id: 1,
      module_name: 'Module 1: Basics of Motion',
      description: 'An introduction to the basics of motion',
      course_id: 1,
    });
    await modulesStore.put({
      id: 2,
      module_name: 'Module 2: Energy and Work',
      description: 'Understanding energy and work',
      course_id: 1,
    });
    await modulesStore.put({
      id: 3,
      module_name: 'Module 1: Algebra Fundamentals',
      description: 'Basic algebraic principles',
      course_id: 2,
    });

    // Seed Assignments
    const assignmentsStore = tx.objectStore('assignments');
    await assignmentsStore.put({
      id: 1,
      assignment_name: 'Assignment 1',
      module_id: 1,
      assignment_type: 'homework',
      grading_criteria: 'accuracy',
    });

    // Seed Quizzes
    const quizzesStore = tx.objectStore('quizzes');
    await quizzesStore.put({
      id: 1,
      quiz_name: 'Quiz 1',
      description: 'Test your knowledge on basic motion',
      module_id: 1,
    });
    await quizzesStore.put({
      id: 2,
      quiz_name: 'Quiz 2',
      description: 'Test your knowledge on energy and work',
      module_id: 2,
    });
    await quizzesStore.put({
      id: 3,
      quiz_name: 'Quiz 1',
      description: 'Test your knowledge on algebra fundamentals',
      module_id: 3,
    });

    await tx.done;
    console.log('Database seeded with initial data.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Initialize and seed the database
await clearDatabase(); // Clears existing data to ensure stores are created fresh
await seedDatabase(); // Seeds initial data

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
const addQuizToModule = async (moduleId, quizTitle, quizDescription, questions = []) => {
  const db = await initDB();
  const tx = db.transaction('quizzes', 'readwrite');
  const quizzesStore = tx.objectStore('quizzes');
  const newQuiz = {
    quiz_name: quizTitle,
    description: quizDescription, // Store the description
    module_id: moduleId,
  };
  const quizId = await quizzesStore.add(newQuiz);
  await tx.done;

  await addQuestionsToQuiz(quizId, questions);

  console.log('Quiz successfully added:', { ...newQuiz, id: quizId });
  return { ...newQuiz, id: quizId };
};



// Function to add questions and answers to a quiz
const addQuestionsToQuiz = async (quizId, questions) => {
  try {
    const db = await initDB();
    const tx = db.transaction('questions', 'readwrite');
    const questionsStore = tx.objectStore('questions');

    for (const question of questions) {
      const questionData = {
        question_text: question.text,
        quiz_id: quizId,
        question_type: question.type,
      };
      const questionId = await questionsStore.add(questionData);

      // Add answers associated with each question
      await addAnswersToQuestion(questionId, question.options);
    }

    await tx.done;
    console.log('Questions successfully added.');
  } catch (error) {
    console.error('Error adding questions:', error);
  }
};

// Function to add answers to a question
const addAnswersToQuestion = async (questionId, options) => {
  if (!Array.isArray(options)) {
    console.error('Options is not iterable:', options);
    return;
  }

  try {
    const db = await initDB();
    const tx = db.transaction('answers', 'readwrite');
    const store = tx.objectStore('answers');

    for (const option of options) {
      const newAnswer = {
        answer_text: option.text,
        correct: option.correct ? 1 : 0,
        question_id: questionId,
      };
      await store.add(newAnswer);
    }

    await tx.done;
    console.log('Answers successfully added.');
  } catch (error) {
    console.error('Error adding answers:', error);
  }
};

// Example implementation of validateTeacherLogin
const validateTeacherLogin = async (username, password) => {
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
    const studentIds = allEnrollments
      .filter((enrollment) => enrollment.course_id === courseId)
      .map((enrollment) => enrollment.student_id);
    const studentsStore = db.transaction('users', 'readonly').objectStore('users');
    const students = await Promise.all(
      studentIds.map(async (studentId) => await studentsStore.get(studentId))
    );
    return students;
  } catch (error) {
    console.error('Error fetching students by course ID:', error);
    return [];
  }
}

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
};
