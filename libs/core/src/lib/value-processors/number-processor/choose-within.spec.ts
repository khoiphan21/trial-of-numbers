import { chooseWithin } from './choose-within';

describe(chooseWithin, () => {
  it('should return the min value if given value is equal or lower', () => {
    expect(chooseWithin(2, 4, 1000)).toEqual(4);
  });

  it('should return the max value if given value is equal or higher', () => {
    expect(chooseWithin(2, -1000, 1)).toEqual(1);
  });

  it('should return the given value if within range', () => {
    expect(chooseWithin(2, -1000, 1000)).toEqual(2);
  });

  it('should return given value but warn if min and max are swapped', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    expect(chooseWithin(2, 1000, -1000)).toEqual(2);

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
