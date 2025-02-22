export interface EntityWithIdAndOrder {
  id: string;
  order: number;
  _deleted: boolean;
}

export const STARTING_ORDER = 1;

export type InsertOrder = 'BEFORE' | 'AFTER';
