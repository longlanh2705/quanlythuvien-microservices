import axios from 'axios';
import { API_BASE_URL } from '../config';

const settingApi = axios.create({
  baseURL: `${API_BASE_URL}/api/settings`,
});

export const getSettings = async () => {
  try {
    const response = await settingApi.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateSetting = async (key, value) => {
  try {
    const response = await settingApi.put(`/${key}`, { value });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
