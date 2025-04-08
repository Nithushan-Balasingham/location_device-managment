import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


export const addUser = async (data:{email:string, name:string, password:string}) => {
  try {
    const response = await api.post("/users/signup", data);
    return response.data;
  } catch (error: unknown) {
    if (
      error instanceof AxiosError &&
      error.response &&
      error.response.data &&
      error.response.data.message
    ) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("An unknown error occurred while adding the location.");
    }
  }
};

