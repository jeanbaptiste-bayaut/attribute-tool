import { create } from 'zustand';
import { Image } from '../types/product.schemas';

type ImageStore = {
  images: Image[];
  setAllImages: (images: Image[]) => void;
  indexImage: number;
  setIndexImage: (index: number) => void;
};

const useImages = create<ImageStore>((set) => ({
  images: [] as Image[],
  setAllImages: (images: Image[]) => set({ images }),
  indexImage: 0,
  setIndexImage: (index: number) => set({ indexImage: index }),
}));

export default useImages;
