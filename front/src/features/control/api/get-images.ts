import axios from 'axios';
import { FetchImagesProps } from '../types/product.schemas';

export const getImages = async ({ style, brand, color }: FetchImagesProps) => {
  const urlbase = `https://images.napali.app/global/${brand}-products/all/default/hi-res/`;

  try {
    let imageUrls = [];
    const response = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/images/${brand}/${style}/${color}`
    );

    if (!response.data) {
      imageUrls.push({
        url: `https://images.napali.app/_/${brand}/hires/${style}_${color}.jpg`,
      });
    } else {
      
      imageUrls = response.data.map((image: { name: string }) => {
        return { url: urlbase + image.name };
      });

    }

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw error;
  }
};

export const getAvailableColors = async ({ style }: FetchImagesProps) => {
  try {
    const response = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/images/colors/${style}/`
    );

    if (response.data) {
      return response.data;
    }

    throw new Error('No data found');
  } catch (error) {
    console.error('Error fetching available colors:', error);
    throw error;
  }
};
