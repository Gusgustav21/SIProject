import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ESPACIOS_INICIALES, type Spaces } from '../data/spaces';

// Solo los datos que se persisten en localStorage (sin las funciones/acciones)
interface PersistedSpaceState {
  spaces: Spaces[];
}

interface SpaceState extends PersistedSpaceState {
  // Acciones sincrónicas locales
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
      name: 'facyt_spaces_storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persiste los datos, no las funciones
      partialize: (state): PersistedSpaceState => ({
        spaces: state.spaces,
      }),
    }
  )
);
