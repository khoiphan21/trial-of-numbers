import { AppEntity } from '@luna/definitions';
import { addDoc, FirestoreTransaction, getDocRef } from '@luna/firebase';

export function makeAddFunction<Entity extends AppEntity>(
  transaction?: FirestoreTransaction
) {
  return async (entity: Entity): Promise<Entity> => {
    await addEntityAndCommand(entity, transaction);

    return entity;
  };
}

async function addEntityAndCommand<Entity extends AppEntity>(
  entity: Entity,
  transaction?: FirestoreTransaction
) {
  if (!entity._type) throw Error(`Invalid entity type "${entity._type}"`);

  if (transaction) {
    // Add the entity and the command via the transaction given
    transaction.set(getDocRef(entity._type, entity.id), entity);
    return;
  }

  // Create and add the EntityCommand
  await addDoc(entity._type, entity);
}
