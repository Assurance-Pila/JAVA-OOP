// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const employeeAPI = {
  getMyReports: () => api.get('/employee/reports'),
  submitReport: (data) => api.post('/employee/reports', data),
};

export default api;