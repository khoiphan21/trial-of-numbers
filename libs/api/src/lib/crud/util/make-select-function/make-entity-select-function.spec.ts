/**
 * @jest-environment node
 */
import { getFirstValue } from '@luna/core';
import { makeAccount } from '@luna/model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  mockGetMyAccount,
  setupFireAndAddAllEntities,
} from '../../../../testing';
import { selectAccount, updateAccount } from '../../account';

describe('makeEntitySelectFunction()', () => {
  // Using Account as the sample Entity

  it('should return the matching entity', async () => {
    const entity = makeAccount({ firstName: 'foo' });

    mockGetMyAccount();
    await setupFireAndAddAllEntities(entity);

    const result = await getFirstValue({
      observable: selectAccount(entity.id),
    });
    expect(result).toEqual(entity);
  });

  it('should return undefined if no ID given', async () => {
    expect(
      await getFirstValue({
        observable: selectAccount(null as any),
        truthyOnly: false,
      })
    ).toBeUndefined();
  });

  it('should notify when changes occur', (done) => {
    const entity = makeAccount({ firstName: 'foo' });

    const updatedFirstName = 'bar';

    mockGetMyAccount();

    setupFireAndAddAllEntities(entity).then(() => {
      const done$ = new Subject<void>();

      selectAccount(entity.id)
        .pipe(takeUntil(done$))
        .subscribe((value) => {
          if (value?.firstName === updatedFirstName) {
            expect(value?.firstName).toEqual(updatedFirstName);
            done$.next();
            done();
          }
        });

      setTimeout(
        () =>
          updateAccount(entity.id, {
            replace: { firstName: updatedFirstName },
          }),
        50
      );
    });
  });
});
