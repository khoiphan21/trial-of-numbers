/**
 * @Assumption MATH_01
 */
const TOLERANCE = 0.000000001;

export function formatDecimalForDisplay(value: number | undefined): string {
  if (!value) return '';

  let digit = 0;

  while (!sameDecimalValue(Number(value.toFixed(digit)), value)) {
    digit++;
  }

  return value.toFixed(digit);
}

export function sameDecimalValue(a: number, b: number): boolean {
  return Math.abs(a - b) < TOLERANCE;
}
