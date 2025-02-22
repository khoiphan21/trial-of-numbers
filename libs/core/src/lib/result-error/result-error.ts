/**
 * Create a new error message based on the given context and base error
 *
 * @param context the action that failed. The format should be
 *                <imperative verb> + <subject>.
 *                Example: 'create form', 'update block'
 * @param baseError the base error to be attached to the given context
 *
 * @returns the formatted error message
 */
export function ResultError(context: string, baseError: string): string {
  return `Failed to ${context.trim().toLocaleLowerCase()}: ${baseError.trim()}`;
}
