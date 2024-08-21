import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

export const analyzeData = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/analyze/`, data);
        return response.data;
    } catch (error) {
        console.error("There was an error analyzing the data!", error);
        throw error;
    }
};
