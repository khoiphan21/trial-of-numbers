import { getName } from './get-name';

describe('getName', () => {
  it('should return object name property', async () => {
    const { result, entity } = setup({ name: 'some name' });
    expect(result).toEqual(entity.name);
  });

  it('should return object title property', async () => {
    const { result, entity } = setup({ title: 'some title' });

    expect(result).toEqual(entity.title);
  });

  it('should return empty string object does not have name or title', async () => {
    expect(getName({ nameTitle: 'should not return this' } as any)).toEqual('');
  });
});

interface EntityWithNameOrTitle {
  name?: string;
  title?: string;
}

export function setup(entity: Partial<EntityWithNameOrTitle>) {
  const result = getName(entity);

  return { entity, result };
}
