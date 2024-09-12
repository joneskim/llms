import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Fetch all quizzes for a specific module
export const fetchQuizzesByModuleId = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by module ID:', error);
    return [];
  }
};

// Add a quiz to a module
export const addQuizToModule = async (quizData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/quizzes`, quizData);
    return response.data;
  } catch (error) {
    console.error('Error adding quiz to module:', error);
    throw error;
  }
};

// Fetch quizzes by student in a course
export const fetchQuizzesByStudentInCourse = async (courseId) => {
  try {
    console.log('Fetching quizzes by student in course:', courseId);
    const response = await axios.get(`${API_BASE_URL}/quizzes/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes by student in course:', error);
    return [];
  }
};

// Fetch a quiz by ID
export const fetchQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz by ID:', error);
    throw error;
  }
};

// Update quiz in module
export const updateQuizInModule = async (quizId, updatedQuiz) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/quizzes/${quizId}`, updatedQuiz);
    return response.data;
  } catch (error) {
    console.error('Error updating quiz:', error);
    throw error;
  }
};

// Submit a quiz result
export const submitQuiz = async (quizId, studentId, answers) => {
  try {
    console.log('Submitting quiz:', { quizId, studentId, answers });
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
export const fetchStudentQuizResults = async (quizId, studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/results`, {
      params: { student_id: studentId }
    });
    console.log('Fetched student quiz results:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching student quiz results:', error);
    return null;
  }
};

// Fetch quiz results by quiz ID
export const fetchResultsByQuizId = async (quizId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/quizzes/${quizId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results by quiz ID:', error);
    return [];
  }
};
