import { AppEntity, CollectionType } from '@luna/definitions';
import { makeAppEntity } from '../app-entity.model';

export const createMakeFunction = <Entity extends AppEntity>(
  createDefaultEntity: () => Entity
) => {
  return (params: Partial<Entity> = {}): Entity => {
    return Object.freeze({
      ...createDefaultEntity(),
      ...params,
    });
  };
};

/**
 * Create a `make()` function that can take some default values to set initially
 * and forces the user to define any required props when using the `make()`
 * function.
 *
 * This create function allows more flexibility in setting default values, but
 * also allows user to overrides those default values if necessary. Another
 * benefit is that this type of `make()` function forces the user to think about
 * all required properties and set them correctly initially.
 *
 * @param type the collection it belongs to
 * @param defaultProps any default values that should be set
 * @returns
 */
export const createStrictMakeFunction = <Entity extends AppEntity>(
  type: CollectionType,
  defaultProps: Partial<Entity> = {}
) => {
  /**
   * The make() function needs to receive all required props for the Entity,
   * but can also receive any props from AppEntity (normally for testing,
   * since AppEntity props are normally set by default)
   */
  return (
    params: Omit<Entity, keyof AppEntity> & Partial<AppEntity>
  ): Readonly<Entity> =>
    Object.freeze({
      ...makeAppEntity(),
      _type: type,
      ...defaultProps,
      ...params,
    } as Entity);
};
