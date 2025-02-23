import { shortUuid } from '@luna/core';

export const createMockFile = (name = `${shortUuid()}.png`) => {
  const file = new File(['a', 'b', 'c', 'd'], name);
  Object.defineProperty(file, 'size', { value: 1024 * 1024 + 1 });
  Object.defineProperty(file, 'text', { value: 'bla' });

  return file;
};
