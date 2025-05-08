import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true, // Ensure cookies are sent with requests
});

import AuthService from '@/services/auth.service';

api.interceptors.response.use(
    res => res,
    async error => {
      const original = error.config;
      if (error.response.status === 401 && !original._retry) {
        original._retry = true;
        try {
          await AuthService.refreshToken();
          return api(original);
        } catch (e) {
          await AuthService.logout();
          window.location.href = '/connexion';
          return Promise.reject(e);
        }
      }
      return Promise.reject(error);
    }
);



export default {
  async get(url, config = {}) {
    return api.get(url, config);
  },
  async post(url, data, config = {}) {
    return api.post(url, data, config);
  },
  async patch(url, data, config = {}) {
    return api.patch(url, data, config);
  },
  async delete(url, config = {}) {
    return api.delete(url, config);
  },
};