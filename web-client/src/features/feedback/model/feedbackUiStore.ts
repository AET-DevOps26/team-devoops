import { create } from 'zustand'

export type FeedbackRatingFilter = 'all' | 'high' | 'medium' | 'low'
export type FeedbackSort = 'date-desc' | 'date-asc' | 'event-asc' | 'event-desc' | 'rating-desc' | 'rating-asc'

export interface FeedbackComposeTarget {
  id: string
  name: string
  eventId?: string
}

export interface FeedbackEditTarget {
  id: string
  memberName: string
  eventName: string
  feedback: string
  rating: number
}

export interface FeedbackFilters {
  search: string
  rating: FeedbackRatingFilter
  sport: string
  coachId: string
  fromDate: string
  toDate: string
  sort: FeedbackSort
}

const defaultFilters: FeedbackFilters = {
  search: '',
  rating: 'all',
  sport: 'all',
  coachId: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-desc',
}

interface FeedbackUiState {
  openFeedbackId: string | null
  composeTarget: FeedbackComposeTarget | null
  composeNotice: string | null
  editTarget: FeedbackEditTarget | null
  filters: FeedbackFilters
  open: (id: string) => void
  close: () => void
  openCompose: (target: FeedbackComposeTarget) => void
  closeCompose: () => void
  setComposeNotice: (notice: string | null) => void
  openEdit: (target: FeedbackEditTarget) => void
  closeEdit: () => void
  setSearch: (search: string) => void
  setRating: (rating: FeedbackRatingFilter) => void
  setSport: (sport: string) => void
  setCoachId: (coachId: string) => void
  setDateRange: (range: Pick<FeedbackFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: FeedbackSort) => void
  resetFilters: () => void
}

export const useFeedbackUiStore = create<FeedbackUiState>((set) => ({
  openFeedbackId: null,
  composeTarget: null,
  composeNotice: null,
  editTarget: null,
  filters: defaultFilters,
  open: (id) => set({ openFeedbackId: id }),
  close: () => set({ openFeedbackId: null }),
  openCompose: (target) => set({ composeTarget: target, composeNotice: null }),
  closeCompose: () => set({ composeTarget: null }),
  setComposeNotice: (notice) => set({ composeNotice: notice }),
  openEdit: (target) => set({ editTarget: target }),
  closeEdit: () => set({ editTarget: null }),
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setRating: (rating) => set((state) => ({ filters: { ...state.filters, rating } })),
  setSport: (sport) => set((state) => ({ filters: { ...state.filters, sport } })),
  setCoachId: (coachId) => set((state) => ({ filters: { ...state.filters, coachId } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
