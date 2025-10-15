import { UploadListState } from '../types/upload.schemas';
import { create } from 'zustand';

type UploadStore = {
  list: UploadListState;
  setList: (list: UploadListState) => void;
  resetList: () => void;
};

const useUpload = create<UploadStore>((set) => ({
  list: {
    noExistingAttributes: [],
    attributeNotFoundList: [],
  },
  setList: (list: UploadListState) => set({ list }),
  resetList: () =>
    set({
      list: {
        noExistingAttributes: [],
        attributeNotFoundList: [],
      },
    }),
}));

export default useUpload;