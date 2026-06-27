import { create } from 'zustand'

export type FeedbackRatingFilter = 'all' | 'high' | 'medium' | 'low' | 'none'
export type FeedbackSort = 'date-desc' | 'date-asc' | 'event-asc' | 'event-desc' | 'rating-desc' | 'rating-asc'

export interface FeedbackFilters {
  search: string
  rating: FeedbackRatingFilter
  eventId: string
  coachId: string
  fromDate: string
  toDate: string
  sort: FeedbackSort
}

const defaultFilters: FeedbackFilters = {
  search: '',
  rating: 'all',
  eventId: 'all',
  coachId: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-desc',
}

interface FeedbackUiState {
  openFeedbackId: string | null
  filters: FeedbackFilters
  open: (id: string) => void
  close: () => void
  setSearch: (search: string) => void
  setRating: (rating: FeedbackRatingFilter) => void
  setEventId: (eventId: string) => void
  setCoachId: (coachId: string) => void
  setDateRange: (range: Pick<FeedbackFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: FeedbackSort) => void
  resetFilters: () => void
}

export const useFeedbackUiStore = create<FeedbackUiState>((set) => ({
  openFeedbackId: null,
  filters: defaultFilters,
  open: (id) => set({ openFeedbackId: id }),
  close: () => set({ openFeedbackId: null }),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setRating: (rating) => set((state) => ({ filters: { ...state.filters, rating } })),
  setEventId: (eventId) => set((state) => ({ filters: { ...state.filters, eventId } })),
  setCoachId: (coachId) => set((state) => ({ filters: { ...state.filters, coachId } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
