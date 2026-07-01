import axios from 'axios';
import { API_BASE_URL } from '../config';

export const notifApi = axios.create({
  baseURL: `${API_BASE_URL}/api/notifications`,
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
  baseURL: `${API_BASE_URL}/api/reports`,
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
