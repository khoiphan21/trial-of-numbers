export function replacePropIn(original: any) {
  return {
    withMatchingPropsIn: (given: any, defaultObject: any) => {
      Object.keys(given).forEach((key) => {
        const givenValue = given[key];

        if (Array.isArray(givenValue)) {
          // Handle array differently, due to the current limitations
          // where [] cannot be saved properly
          original[key] = givenValue.length ? givenValue : defaultObject[key];
        } else {
          original[key] = givenValue;
        }
      });
    },
  };
}
