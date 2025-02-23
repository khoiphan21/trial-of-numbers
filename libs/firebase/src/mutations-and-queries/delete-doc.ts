import { deleteDoc as firestoreDeleteDoc } from '@firebase/firestore';
import { AppEntity, CollectionType } from '@luna/definitions';
import { mockDeleteDoc, shouldMock } from '../testing';
import { getDocRef } from '../util/get-doc-ref';

export async function deleteDoc<Entity extends AppEntity>(
  type: CollectionType,
  entity: Entity
): Promise<void> {
  if (shouldMock()) {
    mockDeleteDoc(type, entity.id);
    return;
  }

  const docRef = getDocRef(type, entity.id);

  await firestoreDeleteDoc(docRef);
}
