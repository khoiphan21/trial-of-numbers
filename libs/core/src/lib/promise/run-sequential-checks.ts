export type CheckFunction = () => Promise<boolean>;

export async function runSequentialChecks(
  checkFunctions: CheckFunction[]
): Promise<boolean> {
  if (!checkFunctions.length) return true;

  try {
    const results = await getResults(checkFunctions);

    return results.reduce((currentResult, result) => {
      return result && currentResult;
    }, true);
  } catch {
    // if there are any errors, just return false
    return false;
  }
}

async function getResults(checkFunctions: CheckFunction[]): Promise<boolean[]> {
  const results: boolean[] = [];

  for (let i = 0; i < checkFunctions.length; i++) {
    const result = await checkFunctions[i]();

    if (!result) throw Error(`Check returned false at index ${i}`);

    results.push(result);
  }

  return results;
}
