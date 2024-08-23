const simulateDelay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Load data from localStorage or initialize with default data
const loadData = () => {
  const data = localStorage.getItem('lmsData');
  return data ? JSON.parse(data) : { teachers: [], students: [] };
};

// Save data to localStorage
const saveData = (data) => {
  localStorage.setItem('lmsData', JSON.stringify(data));
};

// Initialize data
let data = loadData();

// Fake API calls

export const validateTeacherLogin = async (username, password) => {
  await simulateDelay(500);
  const teacher = data.teachers.find(
    (teacher) => teacher.username === username && teacher.password === password
  );
  return teacher ? { teacher_id: teacher.teacher_id, name: teacher.name } : null;
};

export const fetchCoursesByTeacherId = async (teacherId) => {
  await simulateDelay(500);
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  return teacher ? teacher.courses : [];
};

export const fetchModulesByCourseId = async (courseId) => {
  await simulateDelay(500);
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.modules : [];
};

export const fetchAssignmentsByModuleId = async (courseId, moduleId) => {
  await simulateDelay(500);
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.assignments : [];
};

export const fetchQuizzesByModuleId = async (courseId, moduleId) => {
  await simulateDelay(500);
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  const module = course ? course.modules.find((mod) => mod.module_id === moduleId) : null;
  return module ? module.quizzes : [];
};

export const fetchStudentsByCourseId = async (courseId) => {
  await simulateDelay(500);
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  return course ? course.students : [];
};

export const fetchStudentDetails = async (studentId) => {
  await simulateDelay(500);
  return data.students.find((student) => student.student_id === studentId) || null;
};

// Add a new course
export const addCourse = async (teacherId, courseName) => {
  await simulateDelay(500);
  const teacher = data.teachers.find((teacher) => teacher.teacher_id === teacherId);
  if (teacher) {
    const newCourse = {
      course_id: Date.now(),
      course_name: courseName,
      modules: [],
      students: [],
    };
    teacher.courses.push(newCourse);
    saveData(data);
    return newCourse;
  }
  return null;
};

// Add a new module
export const addModule = async (courseId, moduleName) => {
  await simulateDelay(500);
  const course = data.teachers
    .flatMap((teacher) => teacher.courses)
    .find((course) => course.course_id === courseId);
  if (course) {
    const newModule = {
      module_id: Date.now(),
      module_name: moduleName,
      assignments: [],
      quizzes: [],
    };
    course.modules.push(newModule);
    saveData(data);
    return newModule;
  }
  return null;
};
