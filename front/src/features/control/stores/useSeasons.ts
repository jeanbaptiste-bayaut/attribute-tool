import { create } from 'zustand';
import { Season } from '../types/product.schemas';

type SeasonStore = {
  seasons: Season[];
  setAllSeasons: (seasons: Season[]) => void;
};

const useSeasons = create<SeasonStore>((set) => ({
  seasons: [],
  setAllSeasons: (seasons: Season[]) => set({ seasons }),
}));

export default useSeasons;
