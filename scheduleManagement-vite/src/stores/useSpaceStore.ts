import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ESPACIOS_INICIALES, type Spaces } from '../data/spaces';

interface SpaceState {
  spaces: Spaces[];
  
  // Acciones sincrónicas locales (Persistidas en localStorage)
  addSpace: (newSpace: Spaces) => void;
  setSpaces: (spaces: Spaces[]) => void;
  resetSpaces: () => void;
}

export const useSpaceStore = create<SpaceState>()(
  persist(
    (set) => ({
      spaces: ESPACIOS_INICIALES,

      addSpace: (newSpace) =>
        set((state) => ({
          spaces: [...state.spaces, newSpace],
        })),

      setSpaces: (spaces) => set({ spaces }),

      resetSpaces: () => set({ spaces: ESPACIOS_INICIALES }),
    }),
    {
      name: 'facyt_spaces_storage', // Clave única guardada en LocalStorage
    }
  )
);
