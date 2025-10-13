import axios from 'axios';
import { formatDescription } from '../services/formatDescription';

export const getDescription = async (locale: string, style: string) => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/descriptions/${locale}/${style}`
    );

    if (result.data) {
      const characteristicsFormated = formatDescription(
        result.data.product_characteristic
      );

      const description = {
        ...result.data,
        product_characteristic: characteristicsFormated,
      };
      return description;
    }
  } catch (error) {
    console.error(error);
  }
};
