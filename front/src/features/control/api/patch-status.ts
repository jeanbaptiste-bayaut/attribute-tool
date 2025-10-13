import axios from 'axios';
import { Attribute, Product } from '../types/product.schemas';

export const patchProductAttributeStatus = async (
  product: Product,
  attributes: Attribute[]
) => {
  const productId = product.product_id;

  const result = await axios.patch(
    `${
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL_DEV
    }/api/attributes/status`,
    { attributes }
  );

  if (!result.data) {
    throw new Error(
      `le produit ${productId} n'a pas été mis à jour pour les valeurs`
    );
  }

  return { success: `Produit ${productId} mis à jour` };
};

export const patchProductStatus = async (product: Product) => {
  const productId = product.product_id;

  const result = await axios.patch(
    `${
      process.env.NODE_ENV === 'production'
        ? import.meta.env.VITE_API_URL
        : import.meta.env.VITE_API_URL_DEV
    }/api/products/${productId}`
  );

  if (!result.data) {
    throw new Error(
      `le produit ${productId} n'a pas été mis à jour pour les valeurs`
    );
  }

  return { success: `Produit ${productId} mis à jour` };
};
