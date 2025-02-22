import { isGifFile } from './file-type-tests';

describe(isGifFile, () => {
  it('should return true if the file ends in .gif (non-case-sensitive)', () => {
    expect(isGifFile('abcd.gif')).toBe(true);
    expect(isGifFile('abcd.gIf')).toBe(true);
    expect(isGifFile('abcd.GIF')).toBe(true);
  });

  it('should return false otherwise', () => {
    expect(isGifFile('abcd.jpg')).toBe(false);
    expect(isGifFile('abcd.png')).toBe(false);
    expect(isGifFile('abcdef')).toBe(false);
    expect(isGifFile('a')).toBe(false);
    expect(isGifFile('gif')).toBe(false);
  });
});
