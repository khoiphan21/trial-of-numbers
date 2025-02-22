import { sleep } from '../time';
import { runSequentialChecks } from './run-sequential-checks';

describe(runSequentialChecks, () => {
  it('should return true if no check functions given', async () => {
    const result = await runSequentialChecks([]);

    expect(result).toBe(true);
  });

  it('should return false if the check function returns false', async () => {
    const result = await runSequentialChecks([() => Promise.resolve(false)]);
    expect(result).toBe(false);
  });

  it('should return false if at least one of the check functions returns false', async () => {
    const result = await runSequentialChecks([
      () => Promise.resolve(true),
      () => Promise.resolve(true),
      () => Promise.resolve(false),
      () => Promise.resolve(true),
    ]);
    expect(result).toBe(false);
  });

  it('should return true only if all of the check functions returns true', async () => {
    const result = await runSequentialChecks([
      () => Promise.resolve(true),
      () => Promise.resolve(true),
      () => Promise.resolve(true),
      () => Promise.resolve(true),
    ]);
    expect(result).toBe(true);
  });

  it('should return false if any of the check functions throws an error', async () => {
    const result = await runSequentialChecks([
      () => Promise.resolve(true),
      () => Promise.resolve(true),
      () => Promise.reject('some error'),
      () => Promise.resolve(true),
    ]);
    expect(result).toBe(false);
  });

  it('should run functions sequentially', async () => {
    const values: number[] = [];

    await runSequentialChecks([
      async () => !!values.push(1),
      async () => {
        await sleep(50); // simulate different return times
        values.push(2);
        return true;
      },
      async () => !!values.push(3),
      async () => !!values.push(4),
    ]);

    expect(values).toEqual([1, 2, 3, 4]);
  });

  it('should stop running further functions once a function returns false', async () => {
    const values: number[] = [];

    const result = await runSequentialChecks([
      async () => !!values.push(1),
      async () => !!values.push(2),
      async () => false,
      async () => !!values.push(3),
      async () => !!values.push(4),
    ]);

    expect(result).toBe(false);

    expect(values).toEqual([1, 2]);
  });
});
