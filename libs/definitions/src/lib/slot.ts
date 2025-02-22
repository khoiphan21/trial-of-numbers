export type ValidSlot = 'A' | 'B' | 'C' | 'D';

const VALID_SLOTS: ValidSlot[] = ['A', 'B', 'C', 'D'];

export const getValidSlots = (): ValidSlot[] => [...VALID_SLOTS];
