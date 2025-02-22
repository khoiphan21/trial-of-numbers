export function filterUndefinedProps<T extends object>(given: T): T {
  return Object.keys(given).reduce((filteredObject, key) => {
    const givenValue = given[key as keyof T];

    if (givenValue === undefined) {
      return filteredObject;
    }

    return { ...filteredObject, [key]: givenValue };
  }, {}) as T;
}
