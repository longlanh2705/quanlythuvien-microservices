const getApiBaseUrl = () => {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${hostname}:5000`;
};

export const API_BASE_URL = getApiBaseUrl();
