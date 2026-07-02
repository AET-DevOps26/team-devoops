import { create } from 'zustand'

// Which saved report is open in the reader; null = list view. Ephemeral UI state only.
interface HelperUiState {
  openReportId: string | null
  open: (id: string) => void
  close: () => void
}

export const useHelperUiStore = create<HelperUiState>((set) => ({
  openReportId: null,
  open: (id) => set({ openReportId: id }),
  close: () => set({ openReportId: null }),
}))
