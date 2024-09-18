import axios from 'axios';
import getApiBaseUrl from './apiBase';

const API_BASE_URL = getApiBaseUrl();

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

export const fetchNotificationsByStudentId = async (studentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/students/${studentId}/notifications`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications by student ID:', error);
    return [];
  }
};

// Mark notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/students/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

export const addStudent = async (studentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/students`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error adding student:', error);
    throw error;
  }
}
