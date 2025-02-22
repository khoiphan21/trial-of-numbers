import { lastOf } from '../immutable';

export function isGifFile(fileName: string): boolean {
  const tokens = fileName.toLowerCase().split('.');

  if (tokens.length < 2) return false; // what kind of file has no extension?

  return lastOf(tokens) === 'gif';
}
