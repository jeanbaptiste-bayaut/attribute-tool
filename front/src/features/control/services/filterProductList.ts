import { Product } from '../types/product.schemas';

export const filterProductList = (list: Product[], parentType: string) => {
  console.log('filtering', parentType);
  console.log('list', list);

  return list.filter((product) => product.parent_type === parentType);
};
