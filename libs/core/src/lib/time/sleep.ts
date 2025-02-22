export async function sleep(milliseconds: number) {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, milliseconds);
  });
}

/**
 * A utility function that only returns successfully
 * when the `checkFn` returns true
 *
 * @param description a short description of the check condition
 * @param checkFn the function to run to check the condition
 * @param interval interval between checks
 * @param timeout how long until timeout
 */
export async function sleepUntil(
  description: string,
  checkFn: () => boolean | Promise<boolean>,
  interval = 10,
  timeout = 100
) {
  let time = 0;

  while (time < timeout && !(await checkFn())) {
    await sleep(interval);
    time += interval;
  }

  if (!(await checkFn())) {
    throw Error(
      `given condition "${description}" was never met after ${timeout}ms reached`
    );
  }
}
