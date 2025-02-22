import { nanoid } from '@luna-academy-trial-of-numbers/core';
import { AppEntity } from '@luna-academy-trial-of-numbers/definitions';

export const makeAppEntity = (): Omit<AppEntity, '_type'> => ({
  id: nanoid(),

  _version: nanoid(),
  _createdAt: new Date().valueOf(),
  _createdBy: '',
  _updatedAt: new Date().valueOf(),
  _updatedBy: '',
  _deleted: false,
  _deletedAt: 0,
  order: 0,
});
