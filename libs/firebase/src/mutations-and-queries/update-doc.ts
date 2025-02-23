import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { updateEntity, updateInTransaction } from '../core';
import { mockUpdateDoc, shouldMock } from '../testing';
import { filterUndefinedProps } from '@luna/core';

export async function updateDoc<Entity extends AppEntity>(
  type: CollectionType,
  id: UUID,
  updateProps: Partial<Entity>
): Promise<void> {
  if (shouldMock()) {
    mockUpdateDoc<Entity>(type, id, updateProps);
    return;
  }

  await updateEntity(type, id, updateProps);
}

export async function updateDocInTransaction<Entity extends AppEntity>(
  type: CollectionType,
  id: UUID,
  updateProps: Partial<Entity>
): Promise<void> {
  if (shouldMock()) {
    mockUpdateDoc<Entity>(type, id, updateProps);

    return;
  }

  await updateInTransaction(type, id, () => filterUndefinedProps(updateProps));
}
