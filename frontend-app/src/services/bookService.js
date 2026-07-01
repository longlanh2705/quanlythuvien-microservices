import { catalogApi } from './api';

export const getBooks = async (params = {}) => {
  try {
    const response = await catalogApi.get('/', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getBookById = async (id) => {
  try {
    const response = await catalogApi.get(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createBook = async (bookData) => {
  try {
    const response = await catalogApi.post('/', bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateBook = async (id, bookData) => {
  try {
    const response = await catalogApi.put(`/${id}`, bookData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteBook = async (id) => {
  try {
    const response = await catalogApi.delete(`/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
