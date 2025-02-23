import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { deleteDoc, getDoc, updateDoc } from '@luna/firebase';

export type DeleteFunction = (id: UUID) => Promise<void>;

export const makeDeleteFunction =
  (type: CollectionType) => async (id: UUID) => {
    const currentDoc = await getDoc(type, id);

    if (!currentDoc) {
      return;
    }

    const replaceProps: Partial<AppEntity> = {
      _deleted: true,
      _deletedAt: new Date().valueOf(),
    };

    await Promise.all([updateDoc(type, id, replaceProps)]);
  };

export const makeHardDeleteFunction =
  (type: CollectionType) => async (id: UUID) => {
    const entity = await getDoc(type, id);

    if (!entity) return;

    // This will forever delete an entity, and cannot be reversed
    await deleteDoc(type, entity);
  };
