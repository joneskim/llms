import { openDB } from 'idb';

// Initialize IndexedDB database
const initDB = async () => {
  try {
    const db = await openDB('lmsDatabase', 1, {
      upgrade(db) {
        // Create an object store if it doesn't exist
        if (!db.objectStoreNames.contains('lmsData')) {
          db.createObjectStore('lmsData', { keyPath: 'id' });
        }
      },
    });
    return db;
  } catch (error) {
    console.error('Failed to open IndexedDB:', error);
  }
};

// Load data from IndexedDB or initialize with default data if none exists
const loadData = async () => {
  try {
    const db = await initDB();
    const tx = db.transaction('lmsData', 'readonly');
    const store = tx.objectStore('lmsData');
    const allData = await store.getAll();

    if (allData.length > 0) {
      console.log('Data loaded from IndexedDB:', allData[0]);
      return allData[0]; // Return the first item if data exists
    }

    // Default initial data setup
    const initialData = {
      id: 1,
      teachers: [
        {
          teacher_id: 1,
          username: 'teacher1',
          password: 'password1',
          name: 'John Doe',
          courses: [
            {
              course_id: 101,
              course_name: 'Physics 101',
              modules: [
                {
                  module_id: 201,
                  module_name: 'Module 1: Basics of Motion',
                  module_description: 'An introduction to the basics of motion.',
                  assignments: [],
                  quizzes: [],
                  materials: [],
                },
                {
                  module_id: 202,
                  module_name: 'Module 2: Forces and Energy',
                  module_description: 'Exploring the concepts of forces and energy.',
                  assignments: [],
                  quizzes: [],
                  materials: [],
                },
              ],
              students: [
                {
                  student_id: 301,
                  name: 'Student One',
                  progress: [],
                },
              ],
            },
          ],
        },
      ],
      students: [
        {
          student_id: 301,
          name: 'Student One',
          assignments: [],
          quizzes: [],
          messages: [],
          notifications: [],
        },
      ],
    };

    // Save the initial data to IndexedDB
    await saveData(initialData);
    return initialData;
  } catch (error) {
    console.error('Error loading data from IndexedDB:', error);
  }
};

// Save data to IndexedDB
const saveData = async (data) => {
  try {
    const db = await initDB();
    const tx = db.transaction('lmsData', 'readwrite');
    const store = tx.objectStore('lmsData');
    await store.put(data); // Save or update the data with the key 'id: 1'
    await tx.done;
    console.log('Data successfully saved to IndexedDB:', data);
  } catch (error) {
    console.error('Error saving data to IndexedDB:', error);
  }
};

// Load initial data on setup
let data = await loadData(); // Load data when the app starts

// Fake API Functions

// Validate teacher login
const validateTeacherLogin = async (username, password) => {
  const teacher = data.teachers.find(
    (teacher) => teacher.username === username && teacher.password === password
  );
  return teacher ? { teacher_id: teacher.teacher_id, name: teacher.name } : null;
};

// Fetch courses by teacher ID
const fetchCoursesByTeacherId = async (teacherId) => {
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  return teacher ? teacher.courses : [];
};

// Fetch modules by course ID
const fetchModulesByCourseId = async (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.modules : [];
};

// Fetch assignments by module ID
const fetchAssignmentsByModuleId = async (courseId, moduleId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.assignments : [];
};

// Fetch quizzes by module ID
const fetchQuizzesByModuleId = async (courseId, moduleId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.quizzes : [];
};

// Fetch students by course ID
const fetchStudentsByCourseId = async (courseId) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.students : [];
};

// Fetch detailed student profile
const fetchStudentProfile = async (studentId) => {
  return data.students.find((student) => student.student_id === studentId) || null;
};

// Add a new course
const addCourse = async (teacherId, courseName) => {
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  if (teacher) {
    const newCourse = {
      course_id: Date.now(),
      course_name: courseName,
      modules: [],
      students: [],
    };
    teacher.courses.push(newCourse);
    await saveData(data);
    return newCourse;
  }
  return null;
};

// Add a new module to a course
const addModule = async (courseId, moduleName, moduleDescription = '', resources = []) => {
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  if (course) {
    const newModule = {
      module_id: Date.now(),
      module_name: moduleName,
      module_description: moduleDescription,
      resources: resources,
      assignments: [],
      quizzes: [],
    };
    course.modules.push(newModule);
    await saveData(data);
    return newModule;
  }
  return null;
};

// Add an assignment to a module
const addAssignment = async (moduleId, assignmentName, assignmentType, criteria) => {
  const module = data.teachers
    .flatMap((teacher) => teacher.courses)
    .flatMap((course) => course.modules)
    .find((module) => module.module_id === moduleId);
  if (module) {
    const newAssignment = {
      assignment_id: Date.now(),
      assignment_name: assignmentName,
      assignment_type: assignmentType,
      grading_criteria: criteria,
    };
    module.assignments.push(newAssignment);
    await saveData(data);
    return newAssignment;
  }
  return null;
};

// Add a new quiz to a module
const addQuizToModule = async (courseId, moduleId, quizTitle, questions = []) => {
  console.log("We are here ---- - - - - - - - - - -")
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  console.log(course)
  console.log(courseId, moduleId)
  if (course) {
    const module = course.modules.find((mod) => mod.module_id === moduleId);
    console.log('Module:', module);
    if (module) {
      const newQuiz = {
        quiz_id: Date.now(),
        quiz_title: quizTitle,
        average_score: 0,
        questions: questions.map((q, index) => ({
          question_id: Date.now() + index,
          text: q.text,
          options: q.options.map((opt, idx) => ({
            option_id: Date.now() + index + idx,
            text: opt.text,
          })),
          correct_option_id: q.options.find((opt) => opt.correct)?.option_id,
        })),
      };
      console.log('New Quiz:', newQuiz);
      module.quizzes.push(newQuiz);
      await saveData(data);
      return newQuiz;
    }
  }
  return null;
};

export {
  validateTeacherLogin,
  fetchCoursesByTeacherId,
  fetchModulesByCourseId,
  fetchAssignmentsByModuleId,
  fetchQuizzesByModuleId,
  fetchStudentsByCourseId,
  fetchStudentProfile,
  addCourse,
  addModule,
  addAssignment,
  addQuizToModule,
};
