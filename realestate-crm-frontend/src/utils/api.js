import axios from 'axios';
import API_CONFIG from '../config/api.js';

// Create an axios instance with the configured base URL
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Utility function for making fetch API calls with the correct base URL
export const fetchFromApi = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.details || error.message || 'An error occurred');
  }
  
  return response.json();
};

export default apiClient;
