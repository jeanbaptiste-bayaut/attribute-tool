import { create } from 'zustand';
import { Brand } from '../types/product.schemas';

type BrandStore = {
  brands: Brand[];
  setAllBrands: (brands: Brand[]) => void;
};

const useBrands = create<BrandStore>((set) => ({
  brands: [],
  setAllBrands: (brands: Brand[]) => set({ brands }),
}));

export default useBrands;
