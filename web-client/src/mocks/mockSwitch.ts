// VITE_USE_MOCKS=true => queries serve fixtures; otherwise they hit the backend.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Thunks so the unused branch is never evaluated.
export function mockOr<T>(mock: () => T, live: () => T): T {
  return USE_MOCKS ? mock() : live()
}
