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
  mutationNotice: string | null
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
  setMutationNotice: (notice: string | null) => void
}

export const useOrganizationUiStore = create<OrganizationUiState>((set) => ({
  editorTarget: null,
  sportEditorTarget: null,
  deleteTargetId: null,
  sportDeleteTargetId: null,
  mutationNotice: null,
  openCreateTeam: () => set({ editorTarget: { mode: 'create' }, mutationNotice: null }),
  openEditTeam: (teamId) =>
    set({ editorTarget: { mode: 'edit', teamId }, mutationNotice: null }),
  closeEditor: () => set({ editorTarget: null }),
  openCreateSport: () => set({ sportEditorTarget: { mode: 'create' }, mutationNotice: null }),
  openEditSport: (sportId) =>
    set({ sportEditorTarget: { mode: 'edit', sportId }, mutationNotice: null }),
  closeSportEditor: () => set({ sportEditorTarget: null }),
  openDeleteConfirm: (teamId) => set({ deleteTargetId: teamId }),
  closeDeleteConfirm: () => set({ deleteTargetId: null }),
  openDeleteSportConfirm: (sportId) => set({ sportDeleteTargetId: sportId }),
  closeDeleteSportConfirm: () => set({ sportDeleteTargetId: null }),
  setMutationNotice: (notice) => set({ mutationNotice: notice }),
}))
