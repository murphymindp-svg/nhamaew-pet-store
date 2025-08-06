import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        // const token = localStorage.getItem('authToken');
        // if (token) {
        //   config.headers.Authorization = `Bearer ${token}`;
        // }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling common responses
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle common errors
        if (error.response?.status === 401) {
            // Handle unauthorized access
            console.error('Unauthorized access');
        }
        return Promise.reject(error);
    }
);

// API Functions



/**
 * Generic GET request function
 * @param endpoint - API endpoint path
 * @returns Promise with response data
 */
export const apiGet = async (endpoint: string) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Generic POST request function
 * @param endpoint - API endpoint path
 * @param data - Request payload
 * @returns Promise with response data
 */
export const apiPost = async (endpoint: string, data: any) => {
    try {
        const response = await api.post(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Generic PUT request function
 * @param endpoint - API endpoint path
 * @param data - Request payload
 * @returns Promise with response data
 */
export const apiPut = async (endpoint: string, data: any) => {
    try {
        const response = await api.put(endpoint, data);
        return response.data;
    } catch (error) {
        console.error(`Error putting to ${endpoint}:`, error);
        throw error;
    }
};

/**
 * Generic DELETE request function
 * @param endpoint - API endpoint path
 * @returns Promise with response data
 */
export const apiDelete = async (endpoint: string) => {
    try {
        const response = await api.delete(endpoint);
        return response.data;
    } catch (error) {
        console.error(`Error deleting ${endpoint}:`, error);
        throw error;
    }
};

export default api; 