import { create } from 'zustand';
import { Image } from '../types/product.schemas';

type ImageStore = {
  images: Image[];
  setAllImages: (images: Image[]) => void;
};

const useImages = create<ImageStore>((set) => ({
  images: [] as Image[],
  setAllImages: (images: Image[]) => set({ images }),
}));

export default useImages;
