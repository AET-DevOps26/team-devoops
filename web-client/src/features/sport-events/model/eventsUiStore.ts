import { create } from 'zustand'

import type { EventStatus } from './useEventsViewModel'

export type EventsStatusFilter = 'all' | Extract<EventStatus, 'attended' | 'missed' | 'upcoming'>
export type EventsSort = 'date-asc' | 'date-desc' | 'duration-asc' | 'duration-desc'

export interface EventsFilters {
  search: string
  status: EventsStatusFilter
  fromDate: string
  toDate: string
  sort: EventsSort
}

const defaultFilters: EventsFilters = {
  search: '',
  status: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-asc',
}

interface EventsUiState {
  openEventId: string | null
  filters: EventsFilters
  open: (id: string) => void
  close: () => void
  setSearch: (search: string) => void
  setStatus: (status: EventsStatusFilter) => void
  setDateRange: (range: Pick<EventsFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: EventsSort) => void
  resetFilters: () => void
}

export const useEventsUiStore = create<EventsUiState>((set) => ({
  openEventId: null,
  filters: defaultFilters,
  open: (id) => set({ openEventId: id }),
  close: () => set({ openEventId: null }),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setStatus: (status) => set((state) => ({ filters: { ...state.filters, status } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
