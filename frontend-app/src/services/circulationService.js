import axios from 'axios';

export const circApi = axios.create({
  baseURL: 'http://localhost:5000/api/loans',
  headers: { 'Content-Type': 'application/json' },
});

export const requestLoan = async (loanData) => {
  try {
    const response = await circApi.post('/', loanData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLoans = async () => {
  try {
    const response = await circApi.get('/');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getLoansByUser = async (userId) => {
  try {
    const response = await circApi.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createDirectLoan = async (data) => {
  try {
    const response = await circApi.post('/direct', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const extendLoan = async (id) => {
  try {
    const response = await circApi.put(`/${id}/extend`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const approveLoan = async (id) => {
  try {
    const response = await circApi.put(`/${id}/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const returnBook = async (id, data = {}) => {
  try {
    const response = await circApi.put(`/${id}/return`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
