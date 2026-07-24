import { apiRequest } from '../lib/api'
import type { Event, EventStatus } from '../data/events'

type MongoId = string | { _id: string; toString?: () => string }

interface RawEvent {
  _id: MongoId
  titulo: string
  espacioId: MongoId | { _id: MongoId }
  responsable: string
  fecha: string
  asistentes: number
  horaInicio: string
  horaFin: string
  estado: EventStatus
  createdBy?: MongoId | { _id: MongoId }
}

function idOf(value: MongoId | { _id: MongoId } | undefined): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object' && '_id' in value) {
    const nested = value._id
    return typeof nested === 'string' ? nested : String(nested)
  }
  return String(value)
}

export function normalizeEvent(raw: RawEvent): Event {
  return {
    id: idOf(raw._id),
    titulo: raw.titulo,
    espacioId: idOf(raw.espacioId),
    responsable: raw.responsable,
    fecha: raw.fecha,
    asistentes: raw.asistentes,
    horaInicio: raw.horaInicio,
    horaFin: raw.horaFin,
    estado: raw.estado,
  }
}

export interface CreateEventPayload {
  titulo: string
  espacioId: string
  responsable: string
  fecha: string
  asistentes: number
  horaInicio: string
  horaFin: string
}

export type UpdateEventPayload = Partial<CreateEventPayload>

export const eventsApi = {
  list: async (token: string) => {
    const data = await apiRequest<RawEvent[]>('/events', { method: 'GET', token })
    return data.map(normalizeEvent)
  },

  create: async (token: string, payload: CreateEventPayload) => {
    const data = await apiRequest<{ event: RawEvent }>('/events', {
      method: 'POST',
      token,
      body: payload,
    })
    return normalizeEvent(data.event)
  },

  update: async (token: string, id: string, payload: UpdateEventPayload) => {
    const data = await apiRequest<{ event: RawEvent }>(`/events/${id}`, {
      method: 'PUT',
      token,
      body: payload,
    })
    return normalizeEvent(data.event)
  },

  patchStatus: async (token: string, id: string, estado: EventStatus) => {
    const data = await apiRequest<{ event: RawEvent }>(`/events/${id}/status`, {
      method: 'PATCH',
      token,
      body: { estado },
    })
    return normalizeEvent(data.event)
  },

  remove: async (token: string, id: string) => {
    await apiRequest<{ message: string }>(`/events/${id}`, { method: 'DELETE', token })
  },
}
