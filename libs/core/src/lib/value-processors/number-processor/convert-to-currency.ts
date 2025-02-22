/**
 * @Assumption TABLE_BLOCK_01
 */
export function convertToCurrency(text: string | number): string {
  const givenNumber = Number(text);

  if (isNaN(givenNumber)) return 'NaN';

  if (givenNumber < 0) return `-$${Math.abs(givenNumber).toFixed(2)}`;

  return `$${givenNumber.toFixed(2)}`;
}
