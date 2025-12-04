const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token')
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers,
  }

  const config = {
    ...options,
    headers,
  }

  // Remove Content-Type for FormData
  if (options.body instanceof FormData) {
    delete headers['Content-Type']
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()
    
    if (!response.ok) {
      // Handle 401 Unauthorized - token expired or invalid
      if (response.status === 401) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        throw new Error('Unauthorized. Please login again.')
      }
      
      // Handle validation errors
      if (response.status === 422 && data.errors) {
        const errorMessages = Object.values(data.errors).flat().join(', ')
        throw new Error(errorMessages || data.message || 'Validation error')
      }
      
      throw new Error(data.message || `Error: ${response.statusText}`)
    }
    
    return data
  } catch (error) {
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Network error. Please check if the API server is running.')
    }
    throw error
  }
}

// Authentication API
export const authAPI = {
  register: async (name, email, password, passwordConfirmation) => {
    const data = await apiCall('/register', {
      method: 'POST',
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation || password,
      }),
    })
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return data
  },

  login: async (email, password) => {
    const data = await apiCall('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (data.token) {
      localStorage.setItem('auth_token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
    }
    
    return data
  },

  logout: async () => {
    try {
      await apiCall('/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
    }
  },
}

// Tasks API
export const tasksAPI = {
  getTasks: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    // Map frontend filters to API parameters
    if (filters.status && filters.status !== 'all') {
      // Map 'completed' to 'done', 'pending' to 'open'
      const statusMap = {
        completed: 'done',
        pending: 'open',
      }
      if (statusMap[filters.status]) {
        queryParams.append('status', statusMap[filters.status])
      }
    }
    
    if (filters.priority && filters.priority !== 'all') {
      queryParams.append('priority', filters.priority)
    }
    
    if (filters.search) {
      queryParams.append('search', filters.search)
    }
    
    if (filters.due_from) {
      queryParams.append('due_from', filters.due_from)
    }
    
    if (filters.due_to) {
      queryParams.append('due_to', filters.due_to)
    }
    
    if (filters.page) {
      queryParams.append('page', filters.page)
    }
    
    if (filters.per_page) {
      queryParams.append('per_page', filters.per_page)
    }
    
    const queryString = queryParams.toString()
    return apiCall(`/tasks${queryString ? `?${queryString}` : ''}`)
  },

  getTask: async (id) => {
    return apiCall(`/tasks/${id}`)
  },

  createTask: async (taskData) => {
    return apiCall('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  },

  updateTask: async (id, taskData) => {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  },

  deleteTask: async (id) => {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    })
  },

  bulkCompleteTasks: async (taskIds) => {
    return apiCall('/tasks/bulk-complete', {
      method: 'POST',
      body: JSON.stringify({ task_ids: taskIds }),
    })
  },
}

// Dashboard API
export const dashboardAPI = {
  getStats: async () => {
    return apiCall('/dashboard/stats')
  },
  getPriorityStats: async () => {
    return apiCall('/dashboard/priority-stats')
  },
  getRecentTasks: async () => {
    return apiCall('/dashboard/recent-tasks')
  },
}

export default apiCall

