import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Fetch a student by ID
export const fetchStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student by ID:', error);
    return null;
  }
};

// Fetch a student by unique ID
export const fetchStudentByUniqueId = async (uniqueId) => {
    try {
      const response = await axios.get(`http://localhost:8000/students/uniqueId/${uniqueId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student by unique ID:', error);
      throw error;
    }
  };

// Fetch students by course ID
export const fetchStudentsByCourseId = async (courseId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching students by course ID:', error);
    return [];
  }
};
