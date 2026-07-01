import axios from 'axios';

export const notifApi = axios.create({
  baseURL: 'http://localhost:5000/api/notifications',
  headers: { 'Content-Type': 'application/json' },
});

export const getNotifications = async (userId) => {
  try {
    const response = await notifApi.get(`/?userId=${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const markAsRead = async (id) => {
  try {
    const response = await notifApi.put(`/${id}/read`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const exportReportsApi = axios.create({
  baseURL: 'http://localhost:5000/api/reports',
  headers: { 'Content-Type': 'application/json' },
});

export const exportFines = async () => {
  try {
    const response = await exportReportsApi.get('/fines');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
