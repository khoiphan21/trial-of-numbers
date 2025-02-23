/**
 * @jest-environment node
 */
import {
  getFirstValue,
  makeWith,
  nanoid,
  secondOf,
  shortUuid,
} from '@luna/core';
import { Account } from '@luna/definitions';
import { whereFieldOf } from '@luna/firebase';
import { makeAccount } from '@luna/model';
import { hash } from 'immutable';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  mockGetMyAccount,
  setupFireAndAddAllEntities,
} from '../../../../testing';
import { addAccounts, getAccount, updateAccount } from '../../account';
import { EntitiesObservableService } from '../entities-observable-service';
import { selectDocsFromCollection } from './select-docs-from-collection';

describe('selectDocsFromCollection()', () => {
  // Using Account as the sample Entity

  interface SetupInput {
    email: string;
    accounts: Account[];
    otherAccounts: Account[];
  }

  const createDefault = (): SetupInput => {
    const email = `some-email-${nanoid()}`;

    return {
      email,
      accounts: [
        makeAccount({
          firstName: 'foo',
          lastName: 'bar',
          email,
          _createdAt: 0,
        }),
        makeAccount({
          firstName: 'foo1',
          lastName: 'bar1',
          email,
          _createdAt: 1,
        }),
        makeAccount({
          firstName: 'foo2',
          lastName: 'bar2',
          email,
          _createdAt: 2,
        }),
      ],
      otherAccounts: [
        makeAccount({ firstName: 'foo', lastName: 'bar' }),
        makeAccount({ firstName: 'foo1', lastName: 'bar1' }),
        makeAccount({ firstName: 'foo2', lastName: 'bar2' }),
      ],
    };
  };

  async function setup(given: Partial<SetupInput> = {}) {
    const input = makeWith(createDefault)(given);

    mockGetMyAccount();

    await setupFireAndAddAllEntities(...input.accounts, ...input.otherAccounts);

    const makeConditions = () => [
      whereFieldOf<Account, string>('email', '==', input.email),
    ];

    const docs$ = selectDocsFromCollection<Account>(
      'Account',
      ...makeConditions()
    ).pipe(
      map((accounts) => accounts.sort((a, b) => a._createdAt - b._createdAt))
    );

    const getDocs = () => getFirstValue({ observable: docs$ });

    return { input, makeConditions, getDocs, docs$ };
  }

  it('should select docs based on the conditions given', async () => {
    const { input, getDocs } = await setup({});

    expect(await getDocs()).toEqual(input.accounts);
  });

  it('hash() should return the same value for equal conditions', async () => {
    const { makeConditions } = await setup({});

    expect(hash('Account' + JSON.stringify(makeConditions()))).toEqual(
      hash('Account' + JSON.stringify(makeConditions()))
    );
  });

  it('should return the same observable for equal conditions', async () => {
    const { makeConditions } = await setup({});

    const conditions = makeConditions();

    // allow caching of observable, by default in the app
    EntitiesObservableService.instance.enableTestMode(false);

    const observable1 = selectDocsFromCollection('Account', ...conditions);
    const observable2 = selectDocsFromCollection('Account', ...conditions);

    expect(observable1).toBe(observable2);
  });

  it('should not return deleted docs', async () => {
    const { input, getDocs } = await setup({});

    await addAccounts(makeAccount({ email: input.email, _deleted: true }));

    expect(await getDocs()).toEqual(input.accounts);
  });

  it('should notify when there are changes', (done) => {
    setup({}).then((setupResult) => {
      const { input, docs$ } = setupResult;

      const newName = `new-name-${shortUuid()}`;

      const done$ = new Subject<void>();

      docs$.pipe(takeUntil(done$)).subscribe((accounts) => {
        if (secondOf(accounts)?.firstName === newName) {
          expect(true).toBe(true);
          done$.next();
          done();
        }
      });

      setTimeout(async () => {
        const id = secondOf(input.accounts)?.id || '';

        const secondAccount = await getAccount(id);
        expect(secondAccount?.firstName).toBeTruthy();

        await updateAccount(id, { replace: { firstName: newName } });
      }, 50);
    });
  });
});
