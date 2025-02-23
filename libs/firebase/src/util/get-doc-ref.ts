import { CollectionType, UUID } from '@luna/definitions';
import {
  doc,
  DocumentData,
  DocumentReference,
  getFirestore,
} from 'firebase/firestore';
import { shouldMock } from '../testing';
export interface MockDocRef {
  type: CollectionType;
  id: UUID;
}

export function getDocRef(
  type: CollectionType,
  id: UUID
): DocumentReference<DocumentData> {
  if (shouldMock()) {
    // required for runTransaction() to work
    const mockDocRef: MockDocRef = { type, id };

    return mockDocRef as any;
  }

  return doc(getFirestore(), type, id);
}
