import axios from 'axios';
import Cookies from 'js-cookie';
import getApiBaseUrl from './apiBase';


const API_BASE_URL = getApiBaseUrl();

// Function to validate teacher login
export const validateTeacherLogin = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, { username, password });

    // Assuming the server returns session_token and teacherId upon successful login
    if (response.data.session_token && response.data.teacherId) {
      // Store the session token and teacher ID in cookies
      Cookies.set('session_token', response.data.session_token, { 
        expires: 7, // Expires in 7 days
        secure: true, // Ensures cookie is sent over HTTPS
        sameSite: 'Strict', // Prevents cookie from being sent with cross-site requests
      });
      Cookies.set('teacher_id', response.data.teacherId, { 
        expires: 7,
        secure: true,
        sameSite: 'Strict',
      });
    }

    return response.data;
  } catch (error) {
    console.error('Error validating teacher login:', error);
    // Optionally, you can return a more descriptive error message
    return { success: false, message: error.response?.data?.message || 'Login failed' };
  }
};
