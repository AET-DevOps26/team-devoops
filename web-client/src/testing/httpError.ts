// Test-only: builds an axios-shaped error so tests can reject like the live API does.
// `errors` mirrors the server's bean-validation 400 shape ({message, errors: [{message}]}).
export function httpError(
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
