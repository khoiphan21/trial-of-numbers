export interface FeedbackService {
  show(message: string): any;
}

// Switch this to TRUE to start logging success messages
const DEBUG = true;

export async function safeRun<T>(
  callback: () => T | Promise<T | any>,
  snackbar: FeedbackService,
  message: string,
  successMessage = ''
): Promise<T | undefined> {
  const logSuccess = () => {
    if (successMessage) console.log(successMessage);
  };

  try {
    const callbackResult = callback();

    if (callbackResult instanceof Promise) {
      const actualResult = await callbackResult;

      if (DEBUG) logSuccess();

      return actualResult;
    }

    if (DEBUG) logSuccess();

    return callbackResult;
  } catch (error) {
    console.error(error);

    snackbar.show(message + '. Please check browser console for more details.');
    return undefined;
  }
}

/**
 * Run the given function and return the result without logging out any error.
 *
 * This should only be used for UI-based calls where errors can safely be
 * ignored.
 *
 * **USE WITH CAUTION**
 *
 * @param callback the function to run and return the results from
 */
export async function runAndIgnoreError(callback: () => unknown) {
  try {
    const temp = callback();
    return temp instanceof Promise ? await temp : temp;
  } catch {
    // do nothing. Ignore error as expected
  }
}
