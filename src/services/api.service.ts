import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true // Ensure cookies are sent with requests
})

import AuthService from '@/services/auth.service'

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (original.url?.includes('/auth/refresh-token')) {
      await AuthService.logout()
      return Promise.reject(error)
    }

    if (
      !original.url?.includes('/auth/register') &&
      !original.url?.includes('/auth/login') &&
      error.response.status === 401 &&
      !original._retry
    ) {
      original._retry = true
      try {
        await AuthService.refreshToken()
        return api(original)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }
    return Promise.reject(error)
  }
)

export default {
  async get(url, config = {}) {
    return api.get(url, config)
  },
  async post(url, data, config = {}) {
    return api.post(url, data, config)
  },
  async patch(url, data, config = {}) {
    return api.patch(url, data, config)
  },
  async delete(url, config = {}) {
    return api.delete(url, config)
  }
}
