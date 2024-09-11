// loginApi.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Function to validate teacher login
export const validateTeacherLogin = async (username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username });
    return response.data;
  } catch (error) {
    console.error('Error validating teacher login:', error);
    return null;
  }
};
