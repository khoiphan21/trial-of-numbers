import { ResultError } from './result-error';
describe(ResultError.name, () => {
  it('should return the right message', async () => {
    const context = 'create form';
    const baseError = 'Failed to update block: foo bar';

    expect(ResultError(context, baseError)).toEqual(
      'Failed to create form: Failed to update block: foo bar'
    );
  });

  it('should trim the given context and base error', async () => {
    const context = '     create form     ';
    const baseError = '   Failed to update block: foo bar   ';

    expect(ResultError(context, baseError)).toEqual(
      'Failed to create form: Failed to update block: foo bar'
    );
  });

  it(`should convert the given context to lowercase (don't YELL!)`, async () => {
    const context = 'CREATE FORM';
    const baseError = 'Failed to update block: foo bar';

    expect(ResultError(context, baseError)).toEqual(
      'Failed to create form: Failed to update block: foo bar'
    );
  });
});
