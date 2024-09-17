import axios from 'axios';
import getApiBaseUrl from './apiBase';


const API_BASE_URL = getApiBaseUrl();

// Fetch tasks by course ID
export const fetchTasksByCourseId = async (courseId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks by course ID:', error);
      return [];
    }
  };

// Other task-related functions...
export const fetchTasks = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const addTask = async (task) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

export const deleteTask = async (taskId) => {
  try {
    await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

export const updateTask = async (taskId, updates) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

export const fetchTaskById = async (taskId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/${taskId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching task by ID:', error);
    return null;
  }
};

export const fetchTasksByType = async (taskType) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tasks/type/${taskType}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks by type:', error);
    return [];
  }
};
