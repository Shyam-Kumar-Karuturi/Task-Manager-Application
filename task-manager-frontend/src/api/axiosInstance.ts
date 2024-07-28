import axios from 'axios';
import store from './store';

// Create an Axios instance
const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
      },
});

// Add a request interceptor to include the token in headers
axiosInstance.interceptors.request.use(
    (config) => {
      const state = store.getState();
      const token = state.auth.accessToken;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default axiosInstance;
