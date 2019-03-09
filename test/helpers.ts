
export function expectValidationFailure(f: () => void): void {
  expect(f).toThrowError(/child .* fails because/)
}