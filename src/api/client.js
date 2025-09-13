// src/api/client.js
import axios from 'axios'

// Use the environment variable or fallback to localhost
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api'

console.log('API Base URL:', API_BASE) // Debug log

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // Important for CORS with credentials
})

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url)
    return config
  },
  error => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response received:', response.data)
    return response
  },
  error => {
    console.error('Response error:', error.response || error)
    return Promise.reject(error)
  }
)

export const endpoints = {
  register: '/register',
  check: (identifier) => `/check-registration/${encodeURIComponent(identifier)}`,
  statsLive: '/stats/live-count',
}

export default api