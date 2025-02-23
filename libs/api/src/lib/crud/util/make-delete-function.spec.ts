import { firstOf, makeWith, shortUuid } from '@luna/core';
import { AppEntity } from '@luna/definitions';
import { makeAccount } from '@luna/model';
import { mockGetMyAccount, setupFireAndAddAllEntities } from '../../../testing';
import { getAccount } from '../account';
import { getCommandsForEntity } from '../entity-command';
import { makeDeleteFunction } from './make-delete-function';

describe('makeDeleteFunction()', () => {
  const checkValidTimestamp = (value: any) => {
    expect(new Date(value).valueOf()).toEqual(value);
  };

  describe('for the given entity', () => {
    it('should set _deleted to true', async () => {
      const { updatedEntity } = await setup({});
      expect(updatedEntity?._deleted).toBeTruthy();
    });

    it('should set _deletedAt to a valid timestamp', async () => {
      const { updatedEntity } = await setup({});
      checkValidTimestamp(updatedEntity?._deletedAt);
    });
  });

  describe('the matching EntityCommand', () => {
    it('should be created', async () => {
      const { command } = await setup({});
      expect(command).toBeTruthy();
    });

    it('should have the matching batch ID', async () => {
      const batch = `some-batch-id-${shortUuid()}`;
      const { command } = await setup({ batch });
      expect(command?.batch).toEqual(batch);
    });

    it('should have the matching undoable value', async () => {
      const undoable = false;
      const { command } = await setup({ undoable });
      expect(command?.undoable).toEqual(undoable);
    });

    it('should have the matching replaceProps value', async () => {
      const { command } = await setup();
      const { _deleted, _deletedAt } =
        command?.replaceProps as Partial<AppEntity>;
      expect(_deleted).toBe(true);
      checkValidTimestamp(_deletedAt);
    });

    it('should have currentProps as the given entity value', async () => {
      const { command, input } = await setup({});
      expect(command?.currentProps).toEqual(input.entity);
    });
  });
});

interface SetupInput {
  entity: AppEntity;
  batch: string | undefined;
  undoable: boolean | undefined;
}

const createDefault = (): SetupInput => ({
  entity: makeAccount(),
  batch: undefined,
  undoable: undefined,
});

export async function setup(given: Partial<SetupInput> = {}) {
  const input = makeWith(createDefault)(given);
  const { batch, undoable } = input;

  mockGetMyAccount();

  await setupFireAndAddAllEntities(input.entity);

  // To clear all previous spies to make sure the new spies is setup properly
  // Keep this function before all jest.spyOn(s)
  jest.clearAllMocks();

  await makeDeleteFunction(input.entity._type)(input.entity.id, {
    batch,
    undoable,
  });

  const updatedEntity = await getAccount(input.entity.id);

  const command = firstOf(await getCommandsForEntity(input.entity.id));

  return { input, command, updatedEntity };
}
