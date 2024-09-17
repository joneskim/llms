import axios from 'axios';
import getApiBaseUrl from './apiBase';

const API_BASE_URL = getApiBaseUrl();

// Fetch courses by teacher ID
export const fetchCoursesByTeacherId = async (teacherId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/teacher/${teacherId}`);
    console.log('teacherId:', teacherId);
    console.log('response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by teacher ID:', error);
    return [];
  }
};

// Fetch courses by student ID
export const fetchCoursesByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/courses/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching courses by student ID:', error);
    return [];
  }
};

// Add a course
export const addCourse = async (courseName, description, teacherId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/courses`, {
      course_name: courseName,
      description,
      teacher_id: teacherId,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding course:', error);
    throw error;
  }
};

// Add a module to a course
export const addModule = async (courseId, moduleName, description) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/modules`, {
      course_id: courseId,
      module_name: moduleName,
      description,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding module:', error);
    throw error;
  }
};

// Fetch a module by ID
export const fetchModuleById = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching module by ID:', error);
    return null;
  }
};

// Fetch modules by course ID
export const fetchModulesByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/modules/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching modules by course ID:', error);
    return [];
  }
};

export const fetchAllQuizResultsForCourse = async (courseId) => {
    console.log('Fetching all quiz results for course:', courseId);
    try {
      const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/results`);
      console.log('Quiz results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching all quiz results for course:', error);
      return [];
    }
  };

  export const fetchNotificationsByTeacherId = async (teacherId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/teachers/${teacherId}/notifications/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  };
