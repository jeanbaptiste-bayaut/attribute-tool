import { create } from 'zustand';
import { Description } from '../types/product.schemas';

type DescriptionStore = {
  description: Description | null;
  setDescription: (description: Description | null) => void;
};

const useDescription = create<DescriptionStore>((set) => ({
  description: null,
  setDescription: (description: Description | null) => set({ description }),
}));

export default useDescription;
