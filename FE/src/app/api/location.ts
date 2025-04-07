// utils/api.js

import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080',  // Base URL for your API
});

// Function to fetch location with Bearer token
export const fetchLocation = async (token:string) => {
  try {
    const res = await api.get('/location', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    throw new Error('Error fetching location: ' + error.message);
  }
};
