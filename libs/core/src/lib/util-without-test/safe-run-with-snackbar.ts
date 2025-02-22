import { SnackbarService } from '../services/snack-bar.service';
import { safeRun } from './safe-run';

export function safeRunWithSnackbar<T>(
  callback: () => T | Promise<T | any>,
  callbackDescription: string
) {
  return safeRun(
    callback,
    SnackbarService.instance,
    `Failed to ${callbackDescription}`,
    `Completed: ${callbackDescription}`
  );
}
