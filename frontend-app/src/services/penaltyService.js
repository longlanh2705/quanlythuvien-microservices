import axios from 'axios';
import { API_BASE_URL } from '../config';

const penaltyApi = axios.create({
  baseURL: `${API_BASE_URL}/api/penalties`,
});

export const getPenalties = async () => {
  try {
    const response = await penaltyApi.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const payPenalty = async (id) => {
  try {
    const response = await penaltyApi.put(`/${id}/pay`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
