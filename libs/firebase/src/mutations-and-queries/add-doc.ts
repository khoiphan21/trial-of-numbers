import { doc, getFirestore, setDoc } from '@firebase/firestore';
import { AppEntity, CollectionType } from '@luna/definitions';
import { mockSetDoc, shouldMock } from '../testing';

export async function addDoc<Entity extends AppEntity>(
  type: CollectionType,
  entity: Entity
): Promise<void> {
  if (shouldMock()) {
    mockSetDoc<Entity>(type, entity.id, entity);
    return;
  }

  const docRef = doc(getFirestore(), type, entity.id);

  // merge: true will update the prop if the document already existed
  // instead of overwrite the document
  await setDoc(docRef, filterUndefinedFields(entity), { merge: true });
}

function filterUndefinedFields(object: any): any {
  return Object.keys(object).reduce((currentObj, key) => {
    if (object[key] === undefined) {
      return currentObj;
    } else {
      return { ...currentObj, [key]: object[key] };
    }
  }, {});
}
