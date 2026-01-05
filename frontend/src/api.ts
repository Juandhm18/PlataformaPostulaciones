import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Add interceptor to include token and api key
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    // Include API Key from environment or a default for development
    config.headers['x-api-key'] = import.meta.env.VITE_API_KEY || 'riwi-secret-key';
    return config;
});

export default api;
