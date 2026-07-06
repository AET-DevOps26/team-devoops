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
  selectedMemberId: string | null
  isCreateDialogOpen: boolean
  deleteTargetId: string | null
  mutationNotice: string | null
  setSearch: (search: string) => void
  setKind: (kind: PaymentKindFilter) => void
  setDateRange: (range: Pick<PaymentsFilters, 'fromDate' | 'toDate'>) => void
  setSort: (sort: PaymentsSort) => void
  selectMember: (memberId: string | null) => void
  openCreateDialog: () => void
  closeCreateDialog: () => void
  openDeleteConfirm: (transactionId: string) => void
  closeDeleteConfirm: () => void
  setMutationNotice: (notice: string | null) => void
  resetFilters: () => void
}

export const usePaymentsUiStore = create<PaymentsUiState>((set) => ({
  filters: defaultFilters,
  selectedMemberId: null,
  isCreateDialogOpen: false,
  deleteTargetId: null,
  mutationNotice: null,
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setKind: (kind) => set((state) => ({ filters: { ...state.filters, kind } })),
  setDateRange: (range) =>
    set((state) => ({ filters: { ...state.filters, ...range } })),
  setSort: (sort) => set((state) => ({ filters: { ...state.filters, sort } })),
  selectMember: (memberId) => set({ selectedMemberId: memberId }),
  openCreateDialog: () => set({ isCreateDialogOpen: true }),
  closeCreateDialog: () => set({ isCreateDialogOpen: false }),
  openDeleteConfirm: (transactionId) => set({ deleteTargetId: transactionId }),
  closeDeleteConfirm: () => set({ deleteTargetId: null }),
  setMutationNotice: (notice) => set({ mutationNotice: notice }),
  resetFilters: () =>
    set({
      filters: defaultFilters,
      selectedMemberId: null,
      deleteTargetId: null,
      mutationNotice: null,
    }),
}))
