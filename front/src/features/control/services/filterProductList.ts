import { Product } from '../types/product.schemas';

export const filterProductList = (list: Product[], parentType: string) => {

  return list.filter((product) => product.parent_type === parentType);
};
