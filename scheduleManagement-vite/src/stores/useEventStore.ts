import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { EVENTOS_INICIALES, type Event } from '../data/events';

interface EventState {
  events: Event[];
  
  // Acciones sincrónicas locales (Persistidas automáticamente en localStorage)
  addEvent: (newEvent: Event) => void;
  updateEventStatus: (id: string, estado: Event['estado']) => void;
  setEvents: (events: Event[]) => void;
  resetEvents: () => void;

  // NOTA PARA FUTURA INTEGRACIÓN DE BASE DE DATOS:
  // Cuando se conecte un Backend/API REST, aquí se podrán incorporar métodos como:
  // fetchEventsFromApi: async () => { ... },
  // saveEventToDb: async (event: Event) => { ... }
}

export const useEventStore = create<EventState>()(
  persist(
    (set) => ({
      events: EVENTOS_INICIALES,

      addEvent: (newEvent) =>
        set((state) => ({
          events: [...state.events, newEvent],
        })),

      updateEventStatus: (id, estado) =>
        set((state) => ({
          events: state.events.map((evt) =>
            evt.id === id ? { ...evt, estado } : evt
          ),
        })),

      setEvents: (events) => set({ events }),

      resetEvents: () => set({ events: EVENTOS_INICIALES }),
    }),
    {
      name: 'facyt_events_storage', // Clave principal guardada en LocalStorage
    }
  )
);
