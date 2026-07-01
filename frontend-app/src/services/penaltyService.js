import axios from 'axios';

const penaltyApi = axios.create({
  baseURL: 'http://localhost:5000/api/penalties',
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
