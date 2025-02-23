import { CollectionType, UUID } from '@luna/definitions';
import { Unsubscribe } from 'firebase/database';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { ReplaySubject } from 'rxjs';
import { getFirebaseDatabase } from '../lib';

interface SelectResult<T> {
  subject: ReplaySubject<T>;
  unsubscribe: Unsubscribe;
}

export function select<T>(type: CollectionType, id: UUID): SelectResult<T> {
  const subject = new ReplaySubject<T>(1);

  const unsubscribe = onSnapshot(
    doc(getFirebaseDatabase(), type, id),
    (snapshot) => {
      subject.next(snapshot.data() as T);
    }
  );

  return { subject, unsubscribe };
}

export function selectEntity<T>(
  type: CollectionType,
  id: UUID
): ReplaySubject<T> {
  const { subject } = select<T>(type, id);
  return subject;
}

export async function getEntity<T>(type: CollectionType, id: UUID): Promise<T> {
  const docSnap = await getDoc(doc(getFirebaseDatabase(), type, id));
  return docSnap.data() as T;
}
