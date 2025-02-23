import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import {
  collection,
  doc,
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  getFirestore,
  onSnapshot,
} from 'firebase/firestore';
import { Observable, ReplaySubject } from 'rxjs';
import { mockSelectEntity, shouldMock } from '../testing';

export function selectDoc<Entity extends AppEntity>(
  collectionType: CollectionType,
  id: UUID
): Observable<Entity | undefined> {
  if (shouldMock()) {
    return mockSelectEntity(collectionType, id);
  }

  return selectFromRealFirebase(collectionType, id);
}

function selectFromRealFirebase<Entity extends AppEntity>(
  collectionType: CollectionType,
  id: UUID
): Observable<Entity | undefined> {
  const subject = new ReplaySubject<Entity | undefined>(1);

  const entityDoc = doc(collection(getFirestore(), collectionType), id);

  onSnapshot(entityDoc, {
    next: (snapshot: DocumentSnapshot<DocumentData>) => {
      if (snapshot.data()) {
        subject.next(snapshot.data() as Entity);
      }
    },
    error: (err: FirestoreError) => {
      if (err) {
        console.error(err);
      }
    },
    complete: () => {
      // Do nothing since stream is never ended.
    },
  });

  return subject;
}
