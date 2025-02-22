import { List } from 'immutable';
import { UUID } from '../aliases';

export interface EntityWithId {
  readonly id: UUID;
}

export interface EntityWithOrderAndCreatedAt {
  readonly order: number;
  readonly _createdAt: number;
}

export interface EntityWithIdAndName {
  readonly id: UUID;
  readonly name: string;
}

export interface EntityWithIdAndVersion extends EntityWithId {
  readonly _version: UUID;
}

export interface EntityWithUpdatedAt extends EntityWithId {
  readonly _updatedAt: number;
}

export interface Result<T> {
  readonly data?: T;
  readonly error?: string;
}

/**
 * Others
 */
export type ArrayOrList<T> = Array<T> | List<T>;
