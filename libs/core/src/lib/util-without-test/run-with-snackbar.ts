import { Result } from '@luna-academy-trial-of-numbers/definitions';
import { ResultError } from '../result-error';
import { SnackbarService } from '../services/snack-bar.service';

/**
 * Run a function that return a Result<T> type, logging any errors to the
 * SnackbarService
 *
 * @param context the action that failed. The format should be
 *                <imperative verb> + <subject>.
 *                Example: 'create form', 'update block'
 * @param callback the function to run
 */
export async function runWithSnackbar<T>(
  context: string,
  callback: () => Promise<Result<T>>
): Promise<T | undefined> {
  // just in case someone passes a function that does not return undefined
  // otherwise it will cause an error trying to destructure an undefined value
  const { data, error } = (await callback()) || {};

  if (error) {
    console.error(ResultError(context, error));

    SnackbarService.instance.show(
      `${ResultError(
        context,
        ''
      )}Please check browser console for more details.`
    );

    return undefined;
  }

  return data;
}
