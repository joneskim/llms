import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000';

// Function to validate teacher login
export const validateTeacherLogin = async (username) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username });

    // Store the session token in a cookie
    Cookies.set('session_token', response.data.session_token);

    // stg: Store the teacher ID in a cookie
    Cookies.set('teacher_id', response.data.teacherId);
    

    return response.data;
  } catch (error) {
    console.error('Error validating teacher login:', error);
    return null;
  }
};
