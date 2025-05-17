// API configuration for backend endpoints
const API_CONFIG = {
  // Set the base URL to your deployed backend when in production, localhost for development
  BASE_URL: import.meta.env.PROD
    ? "https://estatemate-2207.onrender.com" // Updated to the correct deployed backend URL
    : "http://localhost:5001",
};

export default API_CONFIG;
