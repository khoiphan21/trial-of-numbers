export type OneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export const ENTITY_COMMAND_TYPES = ['create', 'update', 'delete'] as const;
export type EntityCommandType = (typeof ENTITY_COMMAND_TYPES)[number];
