import { AppEntity, CollectionType } from '@luna/definitions';
import {
  collection,
  DocumentData,
  FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  QueryConstraint as FirebaseQueryConstraint,
  QuerySnapshot,
} from 'firebase/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { QueryConstraint } from '../make-query-constraints';
import { mockSelectEntities, shouldMock } from '../testing';
import { convertToFirebaseQueryConstraints } from './map-conditions-to-firebase-conditions';

export function selectDocs<Entity extends AppEntity>(
  collectionType: CollectionType,
  ...conditions: QueryConstraint[]
): Observable<Entity[]> {
  if (shouldMock()) {
    return mockSelectEntities(collectionType, ...conditions);
  }

  return selectFromRealFirebase(collectionType, ...conditions);
}

function selectFromRealFirebase<Entity extends AppEntity>(
  collectionType: CollectionType,
  ...conditions: QueryConstraint[]
): Observable<Entity[]> {
  const subject = new ReplaySubject<Entity[]>(1);

  const entitiesRef = collection(getFirestore(), collectionType);

  const firebaseConditions: FirebaseQueryConstraint[] =
    convertToFirebaseQueryConstraints(conditions);

  const entitiesQuery = query(entitiesRef, ...firebaseConditions);

  onSnapshot(entitiesQuery, {
    next: (snapshot: QuerySnapshot<DocumentData>) => {
      subject.next(snapshot.docs.map((s) => s.data() as Entity));
    },
    error: (err: FirestoreError) => {
      if (err) {
        console.error(
          `Error getting snapshot for collection ${collectionType}: `,
          err
        );
      }
    },
    complete: () => {
      // Do nothing since stream is never ended.
    },
  });

  return subject;
}
