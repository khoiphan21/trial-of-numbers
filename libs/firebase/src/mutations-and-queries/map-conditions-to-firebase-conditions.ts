import {
  limit,
  orderBy,
  QueryConstraint as FirebaseQueryConstraint,
  where,
  WhereFilterOp,
} from 'firebase/firestore';
import { QueryConstraint } from '../make-query-constraints';

export function convertToFirebaseQueryConstraints(
  conditions: QueryConstraint[]
) {
  return conditions
    .map((condition) => {
      switch (condition.type) {
        case 'where':
          return where(
            String(condition.field),
            condition.condition as WhereFilterOp,
            condition.value
          );
        case 'orderBy':
          return orderBy(String(condition.field), condition.direction);
        case 'limit':
          return limit(condition.limit || 9999);
      }
    })
    .filter((value) => !!value) as FirebaseQueryConstraint[];
}
