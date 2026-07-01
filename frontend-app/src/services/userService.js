import axios from 'axios';
import { API_BASE_URL } from '../config';

export const userApi = axios.create({
  baseURL: `${API_BASE_URL}/api/auth`,
  headers: { 'Content-Type': 'application/json' },
});

export const getUsers = async () => {
  try {
    const response = await userApi.get('/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const toggleLockUser = async (id) => {
  try {
    const response = await userApi.put(`/users/${id}/toggle-lock`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveUser = async (id) => {
  try {
    const response = await userApi.put(`/users/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateUser = async (id, data) => {
  try {
    const response = await userApi.put(`/users/${id}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createStaff = async (data) => {
  try {
    const response = await userApi.post('/users/staff', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
