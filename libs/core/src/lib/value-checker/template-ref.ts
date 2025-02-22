import { TemplateRef } from '@angular/core';

/**
 * Check if the given value is a valid TemplateRef.
 *
 * This check is for the case when the testing component
 * passes random values for the templates
 * @param value The value to check
 */
// eslint-disable-line @typescript-eslint/no-explicit-any
export function isValidTemplate(value: TemplateRef<any>): boolean {
  return !!value && !!value.createEmbeddedView;
}
