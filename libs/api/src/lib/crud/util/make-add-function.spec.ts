import { firstOf, makeWith } from '@luna/core';
import { AppEntity } from '@luna/definitions';
import { makeAccount } from '@luna/model';
import { mockGetMyAccount, setupFireAndAddAllEntities } from '../../../testing';
import { getAccount } from '../account';
import { getCommandsForEntity } from '../entity-command';
import { makeAddFunction } from './make-add-function';

describe('makeAddFunction()', () => {
  it('should add the given entity', async () => {
    const { input } = await setup({});
    expect(await getAccount(input.entity.id)).toEqual(input.entity);
  });
  it('should return the added entity', async () => {
    const { result, input } = await setup({});
    expect(result).toEqual(input.entity);
  });

  it('should create a matching EntityCommand', async () => {
    const { command } = await setup({});

    expect(command).toBeTruthy();
  });
});

interface SetupInput {
  entity: AppEntity;
}

const createDefault = (): SetupInput => ({
  entity: makeAccount(),
});

export async function setup(given: Partial<SetupInput> = {}) {
  const input = makeWith(createDefault)(given);

  mockGetMyAccount();

  await setupFireAndAddAllEntities();

  // To clear all previous spies to make sure the new spies is setup properly
  // Keep this function before all jest.spyOn(s)
  jest.clearAllMocks();

  const result = await makeAddFunction()(input.entity);

  const command = firstOf(await getCommandsForEntity(input.entity.id));

  return { input, result, command };
}
