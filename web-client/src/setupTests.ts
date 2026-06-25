// Tell React's act() scheduler that it's running inside a test environment.
// Without this, any state update outside an act() boundary logs a warning.
// @testing-library/react sets this automatically; we set it manually since
// this project uses raw React DOM APIs in tests.
// @ts-expect-error — IS_REACT_ACT_ENVIRONMENT is not in the TS globals
globalThis.IS_REACT_ACT_ENVIRONMENT = true
