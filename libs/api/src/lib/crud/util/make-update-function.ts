import { makeWith, nanoid, VersionService } from '@luna/core';
import { AppEntity, BatchId, CollectionType, UUID } from '@luna/definitions';
import {
  getDoc,
  replaceUndefinedFields,
  updateDoc,
  updateDocInTransaction,
} from '@luna/firebase';

export interface UpdateEntityCommandInput<T> {
  readonly ignoreVersion: boolean;
  readonly replace: Partial<T>;
  readonly batch: BatchId | undefined;
  readonly undoable: boolean;
  readonly useTransaction: boolean;
}

function createDefault<T extends AppEntity>(): Required<
  UpdateEntityCommandInput<T>
> {
  return {
    ignoreVersion: false,
    replace: {},
    batch: undefined,
    undoable: true,
    useTransaction: false,
  };
}

export const makeUpdateFunction =
  <Entity extends AppEntity>(type: CollectionType) =>
  async (
    id: UUID,
    given: Partial<UpdateEntityCommandInput<Entity>>
  ): Promise<void> => {
    const input = makeWith(() => createDefault<Entity>())(given);

    const currentDoc = await getDoc(type, id);

    if (!currentDoc) {
      return;
    }

    const updateProps = await getUpdateProps<Entity>(input);

    if (input.useTransaction) {
      await updateDocInTransaction(type, id, updateProps);
    } else {
      await updateDoc(type, id, updateProps);
    }

    return;
  };

async function getUpdateProps<Entity extends AppEntity>(
  input: Partial<UpdateEntityCommandInput<Entity>>
): Promise<Partial<Entity>> {
  // Create a _version to control which update comes from this app instance
  const _version = nanoid();

  if (!input.ignoreVersion) {
    VersionService.instance.add(_version);
  }

  return <Partial<Entity>>{
    // Replace props given
    ...replaceUndefinedFields(input.replace),

    // Set default values
    // Note: these values should NOT be part of the EntityCommand
    _version,
    _updatedAt: new Date().valueOf(),
  };
}
