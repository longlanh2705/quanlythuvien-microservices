import axios from 'axios';

// Tạo instance của axios cho catalog service (đi qua API Gateway)
export const catalogApi = axios.create({
  baseURL: 'http://localhost:5000/api/books',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor nếu cần xử lý token sau này
catalogApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default {
  catalogApi,
};
