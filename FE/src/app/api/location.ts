
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
});

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
export const addLocation = async (token: string, values: any) => {
  try {
    const response = await api.post('/location', values, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error adding location: ' + error.message);
  }
};