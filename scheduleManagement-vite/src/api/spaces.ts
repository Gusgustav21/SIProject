import { apiRequest } from '../lib/api'
import type { Spaces } from '../data/spaces'

interface RawSpace {
  _id: string
  nombre: string
  capacidad: number
  tipo: Spaces['tipo']
  ubicacion: string
}

export function normalizeSpace(raw: RawSpace): Spaces {
  return {
    id: String(raw._id),
    nombre: raw.nombre,
    capacidad: raw.capacidad,
    tipo: raw.tipo,
    ubicacion: raw.ubicacion,
  }
}

export interface CreateSpacePayload {
  nombre: string
  capacidad: number
  tipo: Spaces['tipo']
  ubicacion: string
}

export type UpdateSpacePayload = Partial<CreateSpacePayload>

export const spacesApi = {
  list: async (token: string) => {
    const data = await apiRequest<RawSpace[]>('/spaces', { method: 'GET', token })
    return data.map(normalizeSpace)
  },

  create: async (token: string, payload: CreateSpacePayload) => {
    const data = await apiRequest<{ space: RawSpace }>('/spaces', {
      method: 'POST',
      token,
      body: payload,
    })
    return normalizeSpace(data.space)
  },

  update: async (token: string, id: string, payload: UpdateSpacePayload) => {
    const data = await apiRequest<{ space: RawSpace }>(`/spaces/${id}`, {
      method: 'PUT',
      token,
      body: payload,
    })
    return normalizeSpace(data.space)
  },

  remove: async (token: string, id: string) => {
    await apiRequest<{ message: string }>(`/spaces/${id}`, { method: 'DELETE', token })
  },
}
