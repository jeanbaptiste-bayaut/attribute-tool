import axios from "axios";

export const uploadFile = async (endpoint: string, formData: FormData) => {
  // placeholder: implement network call to backend upload endpoint
        const upload = await axios.post(
        `${
          process.env.NODE_ENV === 'production'
            ? import.meta.env.VITE_API_URL
            : import.meta.env.VITE_API_URL_DEV
        }/upload/${endpoint}`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );

    return upload.data;
    }
