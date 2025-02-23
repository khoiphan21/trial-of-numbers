import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import {
  deleteDoc,
  doc,
  runTransaction,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { getFirebaseDatabase } from '../lib';

export async function addEntity(type: CollectionType, entity: AppEntity) {
  await setDoc(doc(getFirebaseDatabase(), type, entity.id), entity);
}

export async function updateInTransaction<T>(
  type: CollectionType,
  entityId: UUID,
  getProps: (entity: T) => Partial<T>
) {
  return runTransaction(getFirebaseDatabase(), async (transaction) => {
    const entityRef = doc(getFirebaseDatabase(), type, entityId);

    const entity = (await transaction.get(entityRef)).data() as T;

    transaction.update(entityRef, {
      ...getProps(entity),
    } as any);
  });
}

export async function updateEntity<T>(
  type: CollectionType,
  entityId: UUID,
  props: Partial<T>
) {
  const docRef = doc(getFirebaseDatabase(), type, entityId);

  return updateDoc(docRef, props as any);
}

export async function deleteEntity(type: CollectionType, entity: AppEntity) {
  await deleteDoc(doc(getFirebaseDatabase(), type, entity.id));
}
