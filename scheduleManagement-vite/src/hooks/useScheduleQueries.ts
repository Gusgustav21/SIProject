import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { eventsApi, type CreateEventPayload, type UpdateEventPayload } from '../api/events'
import { spacesApi, type CreateSpacePayload } from '../api/spaces'
import { useAuthStore } from '../stores/useAuthStore'
import type { EventStatus } from '../data/events'

export const queryKeys = {
  events: ['events'] as const,
  spaces: ['spaces'] as const,
}

function getToken() {
  const token = useAuthStore.getState().token
  if (!token) throw new Error('No autenticado')
  return token
}

export function useEventsQuery() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: () => eventsApi.list(token!),
    enabled: Boolean(token),
  })
}

export function useSpacesQuery() {
  const token = useAuthStore((s) => s.token)
  return useQuery({
    queryKey: queryKeys.spaces,
    queryFn: () => spacesApi.list(token!),
    enabled: Boolean(token),
  })
}

export function useCreateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(getToken(), payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.events }),
  })
}

export function useUpdateEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateEventPayload }) =>
      eventsApi.update(getToken(), id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.events }),
  })
}

export function usePatchEventStatus() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, estado }: { id: string; estado: EventStatus }) =>
      eventsApi.patchStatus(getToken(), id, estado),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.events }),
  })
}

export function useDeleteEvent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => eventsApi.remove(getToken(), id),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.events }),
  })
}

export function useCreateSpace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateSpacePayload) => spacesApi.create(getToken(), payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.spaces }),
  })
}

export function useDeleteSpace() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => spacesApi.remove(getToken(), id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.spaces })
      qc.invalidateQueries({ queryKey: queryKeys.events })
    },
  })
}
