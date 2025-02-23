export const COLLECTION_TYPES = [
  'HintSubmission',
  'NumberGuess',
  'LobbySession',
  'GameSession',
  'Player',
  'HintType',
] as const;
export type CollectionType = (typeof COLLECTION_TYPES)[number];
