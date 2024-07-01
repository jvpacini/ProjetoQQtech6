import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000'; // Adjust the URL as necessary

const api = axios.create({
  baseURL: API_URL,
});

export const sendRecoveryEmail = (email) => {
  return api.post('/send-recovery-email', { email });
};

export const recoverPassword = (token, password) => {
  return api.put(`/recover-password/${token}`, { password });
};

export const loginUser = (email, password) => {
  return api.post('/login-recovery', { email, password });
};

export default api;