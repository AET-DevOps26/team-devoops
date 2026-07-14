/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Keycloak base URL (e.g. http://localhost:8081/auth). */
  readonly VITE_KEYCLOAK_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
