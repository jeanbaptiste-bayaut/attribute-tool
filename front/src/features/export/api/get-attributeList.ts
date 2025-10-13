import axios from 'axios';

export const getStylesWithAttributesToEdit = async (season: number) => {
  const result = await axios.get(
    `${
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL_DEV
    }/api/export/attributes/${season}`
  );
  return result.data;
};
