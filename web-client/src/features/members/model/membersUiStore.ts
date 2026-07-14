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

export type MemberEditorTarget = { mode: 'create' } | { mode: 'edit'; memberId: string }

interface MembersUiState {
  filters: MembersFilters
  setSearch: (search: string) => void
  setTeamId: (teamId: string) => void
  setSport: (sport: string) => void
  resetFilters: () => void
  editorTarget: MemberEditorTarget | null
  deleteTargetId: string | null
  openCreateMember: () => void
  openEditMember: (memberId: string) => void
  closeEditor: () => void
  openDeleteConfirm: (memberId: string) => void
  closeDeleteConfirm: () => void
}

export const useMembersUiStore = create<MembersUiState>((set) => ({
  filters: defaultFilters,
  setSearch: (search) => set((state) => ({ filters: { ...state.filters, search } })),
  setTeamId: (teamId) => set((state) => ({ filters: { ...state.filters, teamId } })),
  setSport: (sport) => set((state) => ({ filters: { ...state.filters, sport } })),
  resetFilters: () => set({ filters: defaultFilters }),
  editorTarget: null,
  deleteTargetId: null,
  openCreateMember: () => set({ editorTarget: { mode: 'create' } }),
  openEditMember: (memberId) => set({ editorTarget: { mode: 'edit', memberId } }),
  closeEditor: () => set({ editorTarget: null }),
  openDeleteConfirm: (memberId) => set({ deleteTargetId: memberId }),
  closeDeleteConfirm: () => set({ deleteTargetId: null }),
}))
