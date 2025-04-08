
import axios ,{AxiosError} from 'axios';

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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error('Error fetching location: ' + error.message);
    } else {
      throw new Error('Error fetching location: An unknown error occurred');
    }
  }
  
};
export const addLocation = async (formData: FormData, token: string) => {
  try {
    const response = await api.post('/location', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("RES", response);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error('An unknown error occurred while adding the location.');
    }
  }
};
