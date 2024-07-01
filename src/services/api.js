import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:5050/api'; // Adjust the URL as necessary

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000, // Optional: Set a timeout for requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add the token to the request headers
axiosInstance.interceptors.request.use(config => {
  const token = Cookies.get('accessToken');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const loginUser = async (email, senha) => {
  console.log('Logging in with:', email, senha);
  return await axiosInstance.post('/login', { email, senha })
    .then(response => {
      const { token } = response.data;
      if (token) {
        Cookies.set('accessToken', token, { expires: 1 / 24 }); // Store the token as a cookie for 1 hour
      }
      return response;
    });
};

export default axiosInstance;
