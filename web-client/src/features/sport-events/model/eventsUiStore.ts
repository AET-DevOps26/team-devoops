import { create } from 'zustand'

import type { EventStatus } from './useEventsViewModel'

export type EventsStatusFilter = 'all' | EventStatus
export type EventsSort = 'date-asc' | 'date-desc' | 'duration-asc' | 'duration-desc'

export interface EventsFilters {
  search: string
  status: EventsStatusFilter
  fromDate: string
  toDate: string
  sort: EventsSort
}

export type EventEditorTarget =
  | { mode: 'create' }
  | { mode: 'edit'; eventId: string }

const defaultFilters: EventsFilters = {
  search: '',
  status: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-asc',
}

interface EventsUiState {
  openEventId: string | null
  editorTarget: EventEditorTarget | null
  deleteTargetId: string | null
  mutationNotice: string | null
  filters: EventsFilters
  open: (id: string) => void
  close: () => void
  openCreate: () => void
  openEdit: (eventId: string) => void
  closeEditor: () => void
  openDeleteConfirm: (eventId: string) => void
  closeDeleteConfirm: () => void
  setMutationNotice: (notice: string | null) => void
  setSearch: (search: string) => void
  setStatus: (status: EventsStatusFilter) => void
  setDateRange: (range: Pick<EventsFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: EventsSort) => void
  resetFilters: () => void
}

export const useEventsUiStore = create<EventsUiState>((set) => ({
  openEventId: null,
  editorTarget: null,
  deleteTargetId: null,
  mutationNotice: null,
  filters: defaultFilters,
  open: (id) => set({ openEventId: id }),
  close: () => set({ openEventId: null, deleteTargetId: null }),
  openCreate: () => set({ editorTarget: { mode: 'create' }, mutationNotice: null }),
  openEdit: (eventId) => set({ editorTarget: { mode: 'edit', eventId }, mutationNotice: null }),
  closeEditor: () => set({ editorTarget: null }),
  openDeleteConfirm: (eventId) => set({ deleteTargetId: eventId }),
  closeDeleteConfirm: () => set({ deleteTargetId: null }),
  setMutationNotice: (notice) => set({ mutationNotice: notice }),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setStatus: (status) => set((state) => ({ filters: { ...state.filters, status } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
