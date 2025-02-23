import { nanoid } from '@luna/core';
import { AppEntity } from '@luna/definitions';

export const makeAppEntity = (): Omit<AppEntity, '_type'> => ({
  id: nanoid(),

  _version: nanoid(),
  _createdAt: new Date().valueOf(),
  _updatedAt: new Date().valueOf(),
  _deleted: false,
  _deletedAt: 0,
  order: 0,
});
