import { padNumber } from './pad-number';

describe('padNumber()', () => {
  it('should add 0 before number if number < 10', () => {
    expect(padNumber(9)).toEqual('09');
  });

  it('should return original number if number >= 10', () => {
    expect(padNumber(10)).toEqual(10);
  });
});
