export function removeEmptyFields<T extends Record<string, unknown>>(
  obj: T
): T {
  return Object.entries(obj)
    .filter(([, v]) => v != undefined || v != null)
    .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {}) as T;
}
