import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EVENTOS_INICIALES, type Event } from '../data/events';

// Solo los datos que se persisten en localStorage (sin las funciones/acciones)
interface PersistedEventState {
  events: Event[];
}

interface EventState extends PersistedEventState {
  // Acciones sincrónicas locales
  addEvent: (newEvent: Event) => void;
  updateEventStatus: (id: string, estado: Event['estado']) => void;
  setEvents: (events: Event[]) => void;
  resetEvents: () => void;

  // NOTA PARA FUTURA INTEGRACIÓN DE BASE DE DATOS:
  // Cuando se conecte un Backend/API REST, aquí se podrán incorporar métodos como:
  // fetchEventsFromApi: async () => { const data = await api.getEvents(); setEvents(data); },
  // saveEventToDb: async (event: Event) => { await api.postEvent(event); addEvent(event); }
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
      name: 'facyt_events_storage',
      storage: createJSONStorage(() => localStorage),
      // Solo persiste los datos, no las funciones
      partialize: (state): PersistedEventState => ({
        events: state.events,
      }),
    }
  )
);
