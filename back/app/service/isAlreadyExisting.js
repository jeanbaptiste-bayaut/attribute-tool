import axios from 'axios';

export const isAlreadyExisting = async (products) => {
  const existingProducts = await axios.get('/api/products');

  return products.filter(
    (product) => !existingProducts.data.includes(product.style)
  );
};
