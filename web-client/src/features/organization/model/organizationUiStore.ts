import { create } from 'zustand'

export interface TeamEditorTarget {
  teamId: string
}

interface OrganizationUiState {
  editorTarget: TeamEditorTarget | null
  mutationNotice: string | null
  openEditTeam: (teamId: string) => void
  closeEditor: () => void
  setMutationNotice: (notice: string | null) => void
}

export const useOrganizationUiStore = create<OrganizationUiState>((set) => ({
  editorTarget: null,
  mutationNotice: null,
  openEditTeam: (teamId) =>
    set({ editorTarget: { teamId }, mutationNotice: null }),
  closeEditor: () => set({ editorTarget: null }),
  setMutationNotice: (notice) => set({ mutationNotice: notice }),
}))
