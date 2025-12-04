// React Native API Service
// Complete API service for React Native with axios

import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = 'http://localhost:8000/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - Add token to requests
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      await AsyncStorage.multiRemove(['auth_token', 'user']);
    }
    return Promise.reject(error);
  }
);

// Authentication API
export const authAPI = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} Response with token and user data
   */
  login: async (email, password) => {
    try {
      const response = await apiClient.post('/login', {
        email: email.trim(),
        password: password,
      });

      // Store token and user data
      if (response.data?.token && response.data?.user) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleError(error, 'Login failed');
    }
  },

  /**
   * Register user
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} passwordConfirmation - Password confirmation
   * @returns {Promise} Response with token and user data
   */
  register: async (name, email, password, passwordConfirmation) => {
    try {
      const response = await apiClient.post('/register', {
        name: name.trim(),
        email: email.trim(),
        password: password,
        password_confirmation: passwordConfirmation || password,
      });

      // Store token and user data
      if (response.data?.token && response.data?.user) {
        await AsyncStorage.setItem('auth_token', response.data.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      return handleError(error, 'Registration failed');
    }
  },

  /**
   * Logout user
   * @returns {Promise} Success status
   */
  logout: async () => {
    try {
      await apiClient.post('/logout');
      await AsyncStorage.multiRemove(['auth_token', 'user']);
      return { success: true };
    } catch (error) {
      // Even if API call fails, clear local storage
      await AsyncStorage.multiRemove(['auth_token', 'user']);
      return handleError(error, 'Logout failed');
    }
  },

  /**
   * Get current user from storage
   * @returns {Object|null} User object or null
   */
  getCurrentUser: async () => {
    try {
      const userJson = await AsyncStorage.getItem('user');
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} True if token exists
   */
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      return !!token;
    } catch (error) {
      return false;
    }
  },
};

// Tasks API
export const tasksAPI = {
  /**
   * Get all tasks
   * @param {Object} filters - Filter options
   * @returns {Promise} Tasks array
   */
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status && filters.status !== 'all') {
        const statusMap = {
          completed: 'done',
          pending: 'open',
        };
        if (statusMap[filters.status]) {
          params.append('status', statusMap[filters.status]);
        }
      }
      
      if (filters.priority && filters.priority !== 'all') {
        params.append('priority', filters.priority);
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.page) {
        params.append('page', filters.page);
      }
      
      if (filters.per_page) {
        params.append('per_page', filters.per_page);
      }

      const queryString = params.toString();
      const response = await apiClient.get(`/tasks${queryString ? `?${queryString}` : ''}`);
      
      return {
        success: true,
        data: response.data.data || [],
        meta: response.data.meta || {},
      };
    } catch (error) {
      return handleError(error, 'Failed to load tasks');
    }
  },

  /**
   * Create task
   * @param {Object} taskData - Task data
   * @returns {Promise} Created task
   */
  createTask: async (taskData) => {
    try {
      const response = await apiClient.post('/tasks', taskData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return handleError(error, 'Failed to create task');
    }
  },

  /**
   * Update task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} Updated task
   */
  updateTask: async (id, taskData) => {
    try {
      const response = await apiClient.put(`/tasks/${id}`, taskData);
      return {
        success: true,
        data: response.data.data,
      };
    } catch (error) {
      return handleError(error, 'Failed to update task');
    }
  },

  /**
   * Delete task
   * @param {number} id - Task ID
   * @returns {Promise} Success status
   */
  deleteTask: async (id) => {
    try {
      await apiClient.delete(`/tasks/${id}`);
      return { success: true };
    } catch (error) {
      return handleError(error, 'Failed to delete task');
    }
  },
};

// Error handler
function handleError(error, defaultMessage) {
  let errorMessage = defaultMessage;

  if (error.response) {
    // Server responded with error
    const status = error.response.status;
    const data = error.response.data;

    if (status === 401) {
      errorMessage = data.message || 'Unauthorized. Please login again.';
    } else if (status === 422) {
      // Validation errors
      if (data.errors) {
        const errorMessages = Object.values(data.errors).flat();
        errorMessage = errorMessages.join(', ');
      } else {
        errorMessage = data.message || 'Validation error';
      }
    } else if (status === 403) {
      errorMessage = data.message || 'Forbidden. You do not have permission.';
    } else if (status === 404) {
      errorMessage = data.message || 'Resource not found';
    } else if (status === 429) {
      errorMessage = 'Too many requests. Please try again later.';
    } else {
      errorMessage = data.message || `Error: ${status}`;
    }
  } else if (error.request) {
    // Request made but no response
    errorMessage = 'Network error. Please check your connection.';
  } else {
    // Other error
    errorMessage = error.message || defaultMessage;
  }

  return {
    success: false,
    error: errorMessage,
  };
}

export default apiClient;

