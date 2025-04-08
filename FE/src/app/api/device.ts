import axios, { AxiosError } from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const fetchDevice = async (token: string) => {
  try {
    const res = await api.get("/device", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error fetching location: " + error.message);
    } else {
      throw new Error("Error fetching location: An unknown error occurred");
    }
  }
};

export const fetchSingleDevice = async (id: number, token: string) => {
    try {
      const res = await api.get(`/device/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error fetching device: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          throw new Error("Error fetching device: No response from server");
        } else {
          throw new Error(`Error fetching device: ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw new Error("Error fetching device: " + error.message);
      } else {
        throw new Error("Error fetching device: An unknown error occurred");
      }
    }
  };
export const addDevice = async (formData: FormData, token: string) => {
  try {
    const response = await api.post("/device", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("RES", response);
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

export const updateDevice = async (id: number, formData: FormData, token: string | undefined) => {
  try {
    const response = await api.patch(`/device/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("RES", response);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
        if (error.response) {
          throw new Error(`Error fetching device: ${error.response.status} - ${error.response.data?.message || error.response.statusText}`);
        } else if (error.request) {
          throw new Error("Error fetching device: No response from server");
        } else {
          throw new Error(`Error fetching device: ${error.message}`);
        }
      } else if (error instanceof Error) {
        throw new Error("Error fetching device: " + error.message);
      } else {
        throw new Error("Error fetching device: An unknown error occurred");
      }
    
  }
};

export const deleteDevice= async (id:number,token: string | undefined) => {
  try {
    const res = await api.delete(`/device/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error("Error Delete location: " + error.message);
    } else {
      throw new Error("Error Delete location: An unknown error occurred");
    }
  }
};