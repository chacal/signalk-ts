
export function expectValidationFailure(f: () => void): void {
  expect(f).toThrowError()
}