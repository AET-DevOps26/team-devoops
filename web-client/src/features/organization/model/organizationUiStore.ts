import { create } from 'zustand'

export type TeamEditorTarget =
  | { mode: 'create' }
  | { mode: 'edit'; teamId: string }

export type SportEditorTarget =
  | { mode: 'create' }
  | { mode: 'edit'; sportId: string }

interface OrganizationUiState {
  editorTarget: TeamEditorTarget | null
  sportEditorTarget: SportEditorTarget | null
  deleteTargetId: string | null
  sportDeleteTargetId: string | null
  openCreateTeam: () => void
  openEditTeam: (teamId: string) => void
  closeEditor: () => void
  openCreateSport: () => void
  openEditSport: (sportId: string) => void
  closeSportEditor: () => void
  openDeleteConfirm: (teamId: string) => void
  closeDeleteConfirm: () => void
  openDeleteSportConfirm: (sportId: string) => void
  closeDeleteSportConfirm: () => void
}

export const useOrganizationUiStore = create<OrganizationUiState>((set) => ({
  editorTarget: null,
  sportEditorTarget: null,
  deleteTargetId: null,
  sportDeleteTargetId: null,
  openCreateTeam: () => set({ editorTarget: { mode: 'create' } }),
  openEditTeam: (teamId) => set({ editorTarget: { mode: 'edit', teamId } }),
  closeEditor: () => set({ editorTarget: null }),
  openCreateSport: () => set({ sportEditorTarget: { mode: 'create' } }),
  openEditSport: (sportId) => set({ sportEditorTarget: { mode: 'edit', sportId } }),
  closeSportEditor: () => set({ sportEditorTarget: null }),
  openDeleteConfirm: (teamId) => set({ deleteTargetId: teamId }),
  closeDeleteConfirm: () => set({ deleteTargetId: null }),
  openDeleteSportConfirm: (sportId) => set({ sportDeleteTargetId: sportId }),
  closeDeleteSportConfirm: () => set({ sportDeleteTargetId: null }),
}))
