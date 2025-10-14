import axios from 'axios';

export const getBrands = async () => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/brands`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return result.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getSeasons = async () => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/seasons`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error('Error fetching brands:', error);
    throw error;
  }
};

export const getParentTypes = async (brand: string, season: number) => {
  
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/values/parent-type/${brand}/${season}`,
      {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return result.data;
  } catch (error) {
    console.error('Error fetching parent types:', error);
    throw error;
  }
};
