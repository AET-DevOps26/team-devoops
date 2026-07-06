import { create } from 'zustand'

export interface MembersFilters {
  search: string
  teamId: string
  sport: string
}

const defaultFilters: MembersFilters = {
  search: '',
  teamId: 'all',
  sport: 'all',
}

interface MembersUiState {
  filters: MembersFilters
  setSearch: (search: string) => void
  setTeamId: (teamId: string) => void
  setSport: (sport: string) => void
  resetFilters: () => void
}

export const useMembersUiStore = create<MembersUiState>((set) => ({
  filters: defaultFilters,
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setTeamId: (teamId) => set((state) => ({ filters: { ...state.filters, teamId } })),
  setSport: (sport) => set((state) => ({ filters: { ...state.filters, sport } })),
  resetFilters: () => set({ filters: defaultFilters }),
}))
