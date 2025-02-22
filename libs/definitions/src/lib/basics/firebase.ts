export const FIREBASE_ENVIRONMENTS = ['development', 'production'] as const;

export type FirebaseEnvironment = (typeof FIREBASE_ENVIRONMENTS)[number];

export const QUERY_CONSTRAINT_TYPES = ['where', 'orderBy', 'limit'] as const;

export type QueryConstraintType = (typeof QUERY_CONSTRAINT_TYPES)[number];

export const FIRESTORE_WHERE_FILTER_OPS = [
  '==',
  '<',
  '<=',
  '!=',
  '>=',
  '>',
  'array-contains',
  'in',
  'array-contains-any',
  'not-in',
];
