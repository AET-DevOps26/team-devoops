/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Keycloak base URL (e.g. http://localhost:8081/auth). */
  readonly VITE_KEYCLOAK_URL?: string
  /** 'true' => feature queries serve fixtures instead of the backend. */
  readonly VITE_USE_MOCKS?: string
  /** Identity override: 'member' | 'coach' | 'director' | 'admin'. */
  readonly VITE_MOCK_PERSONA?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
