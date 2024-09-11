import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';  // Adjust this URL based on your FastAPI server configuration

// Function to validate teacher login
const validateTeacherLogin = async (username) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/teacher`, { params: { username } });
    return response.data;
  } catch (error) {
    console.error('Error validating teacher login:', error);
    return null;
  }
};

// Fetch courses by teacher ID
const fetchCoursesByTeacherId = async (teacherId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/teacher/${teacherId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by teacher ID:', error);
    return [];
  }
};

// Fetch modules by course ID
const fetchModulesByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules by course ID:', error);
    return [];
  }
};

// Fetch assignments by module ID
const fetchAssignmentsByModuleId = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments by module ID:', error);
    return [];
  }
};

// Fetch students by course ID
const fetchStudentsByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students by course ID:', error);
    return [];
  }
};

// Add a course
const addCourse = async (courseName, description, teacherId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses`, {
      course_name: courseName,
      description,
      teacher_id: teacherId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error);
  }
};

// Add a module
const addModule = async (courseId, moduleName, description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/modules`, {
      course_id: courseId,
      module_name: moduleName,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding module:', error);
  }
};

// Fetch module by ID
const fetchModuleById = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    return null;
  }
};

// Fetch quiz by ID
const fetchQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

// Submit a quiz
const submitQuiz = async (quizId, studentId, answers) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
      student_id: studentId,
      answers: answers,
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz:', error);
    throw error;
  }
};

// Fetch student quiz results
const fetchStudentQuizResults = async (quizId, studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/results`, {
      params: { student_id: studentId }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching student quiz results:', error);
    return null;
  }
};

// Fetch student by name
const fetchStudentByName = async (studentName) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/name`, { params: { name: studentName } });
    return response.data;
  } catch (error) {
    console.error('Error fetching student by name:', error);
    throw error;
  }
};

// Fetch student by unique ID
const fetchStudentByUniqueId = async (uniqueId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/uniqueId`, { params: { uniqueId } });
    return response.data;
  } catch (error) {
    console.error('Error fetching student by unique ID:', error);
    throw error;
  }
};

// Fetch student by ID
const fetchStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
};

// Fetch courses by student ID
const fetchCoursesByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by student ID:', error);
    return [];
  }
};

// Fetch results by quiz ID
const fetchResultsByQuizId = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results by quiz ID:', error);
    return [];
  }
};

// Fetch results by assignment ID
const fetchResultsByAssignmentId = async (assignmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results by assignment ID:', error);
    return [];
  }
};

// Fetch tasks
const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

// Add a task
const addTask = async (task) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Delete a task
const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Update a task
const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Fetch task by ID
const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return null;
  }
};

// Fetch tasks by type
const fetchTasksByType = async (taskType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/type/${taskType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    return [];
  }
};

// Update quiz in module
const updateQuizInModule = async (quizId, updatedQuiz) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/quizzes/${quizId}`, updatedQuiz);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

// Fetch tasks by module ID
const fetchTasksByModuleId = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by module ID:', error);
    return [];
  }
};

// Fetch tasks by course ID
const fetchTasksByCourseId = async (courseId, studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/course/${courseId}`, { params: { student_id: studentId } });
    return response.data;
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
  fetchTasksByCourseId,
  fetchResultsByQuizId,
  fetchResultsByAssignmentId,
};
