export const COLLECTION_TYPES = [
  'Game',
  'HintSubmission',
  'NumberGuess',
] as const;
export type CollectionType = (typeof COLLECTION_TYPES)[number];
