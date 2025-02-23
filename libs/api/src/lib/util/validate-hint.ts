import { HintType } from '@luna/definitions';
import jexl from 'jexl';

export function validateHint(
  hint: HintType,
  slotValue: number | undefined
): boolean {
  const jexlResult = jexl.evalSync(hint.validationRule, {
    slotValue: slotValue,
  });

  console.log(jexlResult);

  return !!jexlResult;
}
