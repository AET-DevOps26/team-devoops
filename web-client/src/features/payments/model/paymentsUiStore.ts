import { create } from 'zustand'

export type PaymentKindFilter = 'all' | 'charge' | 'payment'
export type PaymentsSort = 'date-desc' | 'date-asc'

export interface PaymentsFilters {
  search: string
  kind: PaymentKindFilter
  fromDate: string
  toDate: string
  sort: PaymentsSort
}

const defaultFilters: PaymentsFilters = {
  search: '',
  kind: 'all',
  fromDate: '',
  toDate: '',
  sort: 'date-desc',
}

interface PaymentsUiState {
  filters: PaymentsFilters
  setSearch: (search: string) => void
  setKind: (kind: PaymentKindFilter) => void
  setDateRange: (range: Pick<PaymentsFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: PaymentsSort) => void
  resetFilters: () => void
}

export const usePaymentsUiStore = create<PaymentsUiState>((set) => ({
  filters: defaultFilters,
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setKind: (kind) => set((state) => ({ filters: { ...state.filters, kind } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
