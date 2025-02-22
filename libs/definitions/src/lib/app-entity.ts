import { CollectionType } from './collection-types';
import { UUID } from './aliases';

// Base interface for all entities
export interface AppEntity {
  readonly id: UUID;

  readonly _deleted: boolean;
  readonly _deletedAt: number;
  readonly _createdAt: number;
  readonly _createdBy: string;
  readonly _updatedAt: number;
  readonly _updatedBy: string;
  readonly _version: string;

  readonly order: number;

  readonly _type: CollectionType;
}
