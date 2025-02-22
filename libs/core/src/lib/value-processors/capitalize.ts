export function capitalise(value: string | undefined): string {
  if (!value) {
    return '';
  }

  const firstLetter = value[0];
  const remaining = value.slice(1);
  return firstLetter.toUpperCase() + remaining;
}

export function capitaliseEachWordInString(value: string | undefined): string {
  if (!value) {
    return '';
  }

  return value.split(' ').map(capitalise).join(' ');
}
