import { create } from 'zustand';
import { Attribute } from '../types/product.schemas';

type AttributeStore = {
  attributes: Attribute[];
  parent_type: { name: string }[];
  setAllAttributes: (attributes: Attribute[]) => void;
  setParentType: (parent_type: { name: string }[]) => void;
  resetAttributes: () => void;
};

const useAttributes = create<AttributeStore>((set) => ({
  attributes: [] as Attribute[],
  setAllAttributes: (attributes: Attribute[]) => set({ attributes }),
  parent_type: [] as { name: string }[],
  setParentType: (parent_type: { name: string }[]) => set({ parent_type }),
  resetAttributes: () => set({ attributes: [] }),
}));

export default useAttributes;
