// VITE_USE_MOCKS=true => queries serve fixtures; otherwise they hit the backend.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true'

// Thunks so the unused branch is never evaluated.
export function mockOr<T>(mock: () => T, live: () => T): T {
  return USE_MOCKS ? mock() : live()
}

// Builds an axios-shaped error so mock branches can reject like the live API does.
// `errors` mirrors the server's bean-validation 400 shape ({message, errors: [{message}]})
// so per-field form UIs can be exercised without a live backend.
export function mockHttpError(
  status: number,
  message: string,
  errors?: { message: string }[],
): Error {
  return Object.assign(new Error(message), {
    isAxiosError: true,
    response: {
      status,
      data: errors ? { message, errors } : { message },
    },
  })
}
