import { create } from 'zustand';
import { Product } from '../types/product.schemas';

type ProductStore = {
  products: Product[];
  index: number;
  setAllProducts: (products: Product[]) => void;
  setProductIndex: (index: number) => void;
};

const useProducts = create<ProductStore>((set) => ({
  products: [],
  index: 0,
  setAllProducts: (products: Product[]) => set({ products }),
  setProductIndex: (index: number) => set({ index }),
}));

export default useProducts;
