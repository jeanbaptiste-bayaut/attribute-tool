import { UploadListState } from '../types/upload.schemas';
import { create } from 'zustand';

type UploadStore = {
  list: UploadListState;
  setList: (list: UploadListState) => void;
  resetList: () => void;
};

const useUpload = create<UploadStore>((set) => ({
  list: {
    valueNotFoundList: [],
    attributeNotFoundList: [],
    productNotFoundList: [],
  },
  setList: (list: UploadListState) => set({ list }),
  resetList: () =>
    set({
      list: {
        valueNotFoundList: [],
        attributeNotFoundList: [],
        productNotFoundList: [],
      },
    }),
}));

export default useUpload;