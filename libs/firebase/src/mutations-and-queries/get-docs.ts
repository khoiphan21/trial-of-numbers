import { getFirestore } from '@firebase/firestore';
import { AppEntity, CollectionType } from '@luna/definitions';
import {
  collection,
  getDocs as firebaseGetDocs,
  query,
} from 'firebase/firestore';
import { QueryConstraint } from '../make-query-constraints';
import { mockGetDocs, shouldMock } from '../testing';
import { convertToFirebaseQueryConstraints } from './map-conditions-to-firebase-conditions';

export async function getDocs<Entity extends AppEntity>(
  type: CollectionType,
  ...constraints: QueryConstraint[]
): Promise<Entity[]> {
  if (shouldMock()) {
    return mockGetDocs<Entity>(type, ...constraints);
  }

  const entitiesRef = collection(getFirestore(), type);

  const entitiesQuery = query(
    entitiesRef,
    ...convertToFirebaseQueryConstraints(constraints)
  );

  const docsSnapshot = await firebaseGetDocs(entitiesQuery);

  return docsSnapshot.docs.map((snapshot) => snapshot.data()) as Entity[];
}
