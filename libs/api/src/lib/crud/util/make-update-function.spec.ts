import {
  firstOf,
  makeWith,
  shortUuid,
  UIStateService,
  VersionService,
} from '@luna/core';
import { Account } from '@luna/definitions';
import * as Firebase from '@luna/firebase';
import { deleteFirestoreField } from '@luna/firebase';
import { makeAccount } from '@luna/model';
import { mockGetMyAccount, setupFireAndAddAllEntities } from '../../../testing';
import { getAccount } from '../account';
import { getCommandsForEntity } from '../entity-command';
import { makeUpdateFunction } from './make-update-function';

jest.mock('@luna/firebase', () => ({
  __esModule: true,
  ...(jest.requireActual('@luna/firebase') as any),
}));

describe('makeUpdateFunction()', () => {
  it('should update the given prop for the entity', async () => {
    const order = 100;

    const { updatedEntity } = await setup({ replace: { order } });

    expect(updatedEntity?.order).toEqual(order);
  });

  it('should set a new _version', async () => {
    const { updatedEntity, input } = await setup({});
    expect(updatedEntity?._version).not.toEqual(input.entity._version);
  });

  it('should replace undefined fields with deleteField()', async () => {
    const { updatedEntity, updateDocSpy } = await setup({
      replace: { firstName: undefined },
    });
    const firstCall = firstOf(updateDocSpy.mock.calls);

    if (!firstCall) fail('updateDoc was not called');

    const [type, id, updateProps] = firstCall;
    expect((updateProps as Account).firstName).toEqual(deleteFirestoreField());
    expect(updatedEntity?.firstName).toBeUndefined();
  });

  it('should set a new _updatedAt', async () => {
    const { updatedEntity, input } = await setup({});
    expect(updatedEntity?._updatedAt).not.toEqual(input.entity._updatedAt);
  });

  it('should set _updatedBy as the current account', async () => {
    const { updatedEntity, myAccount } = await setup({});
    expect(updatedEntity?._updatedBy).toEqual(myAccount.id);
  });

  describe('ignoreVersion', () => {
    it('when set, should NOT add the version to the VersionService', async () => {
      const { updatedEntity } = await setup({ ignoreVersion: true });
      const version = updatedEntity?._version;

      expect(VersionService.instance.has(version as string)).toBeFalsy();
    });

    it('when not set, should add the version to the VersionService', async () => {
      const { updatedEntity } = await setup({});
      const version = updatedEntity?._version;

      expect(VersionService.instance.has(version as string)).toBeTruthy();
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
      const replace = { order: 100 };
      const { command } = await setup({ replace });
      expect(command?.replaceProps).toEqual(replace);
    });

    it('should have currentProps as the given entity value', async () => {
      const { command, input } = await setup({});
      expect(command?.currentProps).toEqual(input.entity);
    });
  });
});

interface SetupInput {
  entity: Account;
  ignoreVersion: boolean;
  replace: Partial<Account>;
  batch: string | undefined;
  undoable: boolean;
}

const createDefault = (): SetupInput => ({
  entity: makeAccount({
    firstName: 'foo', // to be set undefined in a test
    _version: 'old-version',
    _updatedAt: 0,
    _updatedBy: 'foo',
  }),
  ignoreVersion: false,
  replace: {},
  batch: undefined,
  undoable: false,
});

export async function setup(given: Partial<SetupInput> = {}) {
  const input = makeWith(createDefault)(given);
  const { entity, ignoreVersion, replace, batch, undoable } = input;

  const { myAccount } = mockGetMyAccount();

  jest.clearAllMocks();

  const updateDocSpy = jest.spyOn(Firebase, 'updateDoc');

  UIStateService.setActiveAccount(myAccount.id);

  await setupFireAndAddAllEntities(entity);

  // To clear all previous spies to make sure the new spies is setup properly
  // Keep this function before all jest.spyOn(s)
  jest.clearAllMocks();

  await makeUpdateFunction(entity._type)(entity.id, {
    ignoreVersion,
    replace,
    batch,
    undoable,
  });

  // Add a small delay to ensure command is saved
  await new Promise((resolve) => setTimeout(resolve, 100));

  const updatedEntity = await getAccount(input.entity.id);

  const command = firstOf(await getCommandsForEntity(entity.id));

  return { input, updatedEntity, command, myAccount, updateDocSpy };
}
