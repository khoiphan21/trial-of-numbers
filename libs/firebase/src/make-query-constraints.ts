import { AppEntity, QueryConstraintType } from '@luna/definitions';
import { OrderByDirection } from 'firebase/firestore';
import { FirestoreWhereFilterOp } from './types';

export interface QueryConstraint<Entity = any, FieldType = any> {
  type: QueryConstraintType;
  field?: keyof Entity;
  condition?: FirestoreWhereFilterOp;
  value?: FieldType;
  direction?: OrderByDirection;
  limit?: number;
}

export type WhereQueryConstraint<Entity, FieldType> = Required<
  Pick<
    QueryConstraint<Entity, FieldType>,
    'type' | 'field' | 'condition' | 'value'
  >
>;

export type OrderByQueryConstraint<Entity> = Required<
  Pick<QueryConstraint<Entity>, 'type' | 'field' | 'direction'>
>;

export type LimitQueryConstraint = Required<
  Pick<QueryConstraint, 'type' | 'limit'>
>;

export const whereFieldOf = <Entity extends AppEntity, FieldType>(
  field: keyof Entity,
  condition: FirestoreWhereFilterOp,
  value: FieldType
): WhereQueryConstraint<Entity, FieldType> =>
  Object.freeze({
    type: 'where',
    field,
    condition,
    value,
  });

export const orderByFieldOf = <Entity extends AppEntity>(
  field: keyof Entity,
  direction: OrderByDirection
): OrderByQueryConstraint<Entity> =>
  Object.freeze({
    type: 'orderBy',
    field,
    direction,
  });

export const limitTo = (limit: number): LimitQueryConstraint =>
  Object.freeze({
    type: 'limit',
    limit,
  });
