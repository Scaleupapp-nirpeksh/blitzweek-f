//src/api/client.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 15000,
})

export const endpoints = {
  register: '/register',
  check: (identifier) => `/check-registration/${encodeURIComponent(identifier)}`,
  statsLive: '/stats/live-count',
}

export default api
