import axios from 'axios';

const settingApi = axios.create({
  baseURL: 'http://localhost:5000/api/settings',
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
