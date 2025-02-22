export function chooseWithin(value: number, min: number, max: number): number {
  if (min > max) {
    console.warn(`chooseWithin() given min ${min} is higher than max ${max}`);
    return value;
  }

  if (value < min) {
    return min;
  }

  if (value > max) {
    return max;
  }

  return value;
}
