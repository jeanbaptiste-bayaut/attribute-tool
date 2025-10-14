import axios from 'axios';
import { Product } from '../types/product.schemas';

export const getProducts = async (brand: string, season: string) => {
  try {
    const result = await axios.get(
      `${
        process.env.NODE_ENV === 'production'
          ? import.meta.env.VITE_API_URL
          : import.meta.env.VITE_API_URL_DEV
      }/api/products/${brand}/${season}`
    );
    
    result.data.map((product: Product) => {
      product.brand_name = brand;
    });

    return result.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};
