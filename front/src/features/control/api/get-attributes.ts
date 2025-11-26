import axios from 'axios';

export const getAttributes = async (name: string) => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/values/${name}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error('Error fetching attributes:', error);
    throw error;
  }
};

export const getAttributesListById = async (productId: number) => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/attributes/${productId}`
    );

    return result.data;
  } catch (error) {
    console.error('Error fetching attributes list:', error);
    throw error;
  }
};