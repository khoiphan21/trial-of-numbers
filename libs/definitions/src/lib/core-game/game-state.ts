export const GAME_STATES = ['waiting', 'in_progress', 'completed'] as const;

export type GameState = (typeof GAME_STATES)[number];
