import axios from 'axios';
import getApiBaseUrl from './apiBase';


const API_BASE_URL = getApiBaseUrl();

// Fetch all assignments for a specific module
export const fetchAssignmentsByModuleId = async (moduleId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/module/${moduleId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching assignments by module ID:', error);
    return [];
  }
};

// Fetch all results for a specific assignment
export const fetchResultsByAssignmentId = async (assignmentId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/assignments/${assignmentId}/results`);
    return response.data;
  } catch (error) {
    console.error('Error fetching results by assignment ID:', error);
    return [];
  }
};
