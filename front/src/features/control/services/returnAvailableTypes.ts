import { Product } from '../types/product.schemas';

export const returnAvailableTypes = (list: Product[]) => {
  const availableTypes = list.map((product) => product.parent_type);
  return Array.from(new Set(availableTypes));
};
