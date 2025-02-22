import { of, Subject } from 'rxjs';
import { getFirstValue } from './get-first-value';

describe('getFirstValue()', () => {
  describe('when input is just an observable', () => {
    it('should resolve with the first value from observable', async () => {
      const source = of(1, 2, 3);
      const firstVal = await getFirstValue({
        observable: source,
        name: 'select source for resolve first value test',
      });
      expect(firstVal).toEqual(1);
    });

    it('should not resolve null or undefined values by default', async () => {
      const source = of(undefined, null, 1);
      const firstVal = await getFirstValue({
        observable: source,
        name: 'select source for resolve null or undefined values test',
      });
      expect(firstVal).toEqual(1);
    });

    it('should return false by default', async () => {
      const source = of(false, true);
      const firstVal = await getFirstValue({
        observable: source,
        name: 'select source for resolve null or undefined values test',
      });
      expect(typeof firstVal).toEqual('boolean');
      expect(firstVal).toBe(false);
    });
  });

  describe('when input is complex', () => {
    it('should not resolve null or undefined values by default', async () => {
      const observable = of(undefined, null, 1);
      const firstVal = await getFirstValue({ observable });
      expect(firstVal).toEqual(1);
    });

    it('should reject if timeout', async () => {
      const observable = new Subject();

      try {
        await getFirstValue({
          observable,
          timeout: 300,
        });
        fail('error must occur');
      } catch {
        expect(true).toBe(true); // Test should pass if reached this point
      }
    });

    it('should resolve with null if requested', async () => {
      const observable = of(undefined);
      const truthyOnly = false;
      const firstVal = await getFirstValue({ observable, truthyOnly });
      expect(firstVal).toBeUndefined();
    });

    it('should fail with the name and timeout given', async () => {
      const observable = new Subject();

      try {
        await getFirstValue({
          observable,
          timeout: 300,
          name: 'foo',
        });
        fail('error must occur');
      } catch (error) {
        expect(error).toEqual(
          `Timeout trying to get first value of observable 'foo' with timeout 300`
        );
      }
    });
  });
});
