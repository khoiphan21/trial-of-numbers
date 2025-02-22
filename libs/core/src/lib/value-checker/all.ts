import { List } from 'immutable';

export const notUndefined = <T>(value: T) => value !== undefined;

export const notNull = <T>(value: T) => value !== null;

/**
 * Check if a value is null or undefined
 *
 * @param value The value to check
 *
 * @return true if the value is **not** null or undefined, false otherwise.
 */
export const notNullOrUndefined = <T>(value: T) =>
  notUndefined(value) && notNull(value);

/**
 * Check if a value is of the instance Error
 *
 * @param value the value to check
 *
 * @return true if the value is not an instance of Error
 */
export const notError = <T>(value: T) => !(value instanceof Error);

/**
 * Only return valid entities: not null, undefined or Error
 *
 * @param entity the entity to check
 */
export const onlyValidEntities = <T>(entity: T) =>
  notNullOrUndefined(entity) && notError(entity);

export const onlyTruthyValues = <T>(entity: T) => !!entity;

interface SoftDeleteableEntity {
  _deleted: boolean;
}

export const notDeleted = (entity: SoftDeleteableEntity) => !entity._deleted;

export const hasAtLeastOneItem = <T>(entity: Array<T> | List<T>) =>
  List(entity).size > 0;

export interface HasFilterMethod {
  filter: any;
}

export const filterOnlyValidEntities = <T extends HasFilterMethod>(
  list: T
): T => list.filter(onlyValidEntities);

/**
 * Check the `id` property of the two given objects.
 *
 * @param given The given object
 * @param other The object to compare id with
 *
 * @return true if the ids match, false otherwise
 */
export const idNotMatching = (given: any, other: any) => given.id !== other.id;

export const valueIsTruthy = (value: any) => !!value;

export const pickIfTruthy = <T>(value: T, defaultValue: T): T => {
  return value ? value : defaultValue;
};

export const pickIfDefined = <T>(value: T, defaultValue: T): T => {
  return value !== undefined ? value : defaultValue;
};

export const onlyUnique = <T>(value: T, index: number, self: T[]) => {
  return self.indexOf(value) === index;
};
