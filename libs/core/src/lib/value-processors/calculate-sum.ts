export function calculateSum(
  values: (string | number | undefined)[]
): number | undefined {
  const validValues = values.map((v) => Number(v)).filter((v) => !isNaN(v));

  if (!validValues.length) return undefined;

  return validValues.reduce((sum, value) => sum + value, 0);
}
