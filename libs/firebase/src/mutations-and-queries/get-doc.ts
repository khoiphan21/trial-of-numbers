import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { getDoc as firestoreGetDoc } from 'firebase/firestore';
import { mockGetDoc, shouldMock } from '../testing';
import { getDocRef } from '../util';

export async function getDoc<Entity extends AppEntity>(
  type: CollectionType,
  id: UUID
): Promise<Entity | undefined> {
  if (shouldMock()) {
    return mockGetDoc<Entity>(type, id);
  }

  const snapshot = await firestoreGetDoc(getDocRef(type, id));

  return snapshot.data() as Entity;
}
