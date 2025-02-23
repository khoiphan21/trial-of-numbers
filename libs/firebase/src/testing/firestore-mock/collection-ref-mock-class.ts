import { CollectionType } from '@luna/definitions';
import { OrderByDirection } from 'firebase/firestore';
import { map } from 'rxjs/operators';
import { QueryConstraint } from '../../make-query-constraints';
import { FirestoreWhereFilterOp } from '../../types';
import { mockSelectAllDocs } from './mock-select-all-docs';
import { filterOrderAndLimit, getEntitiesMapSafe } from './util';

export class CollectionRefMock {
  constraints: QueryConstraint[] = [];

  constructor(private type: CollectionType) {}

  where(field: any, condition: FirestoreWhereFilterOp, value: any) {
    this.constraints.push({ type: 'where', field, condition, value });
    return this;
  }

  orderBy(field: any, direction: OrderByDirection) {
    this.constraints.push({ type: 'orderBy', field, direction });
  }

  limit(amount = 9999) {
    this.constraints.push({ type: 'limit', limit: amount });
  }

  private getAllEntitySubjects() {
    const entitiesMap = getEntitiesMapSafe(this.type);

    if (!entitiesMap) {
      return [];
    }

    return Array.from(entitiesMap.values());
  }

  getEntitySubjects() {
    return mockSelectAllDocs(this.type).pipe(
      map((allEntities) => filterOrderAndLimit(allEntities, this.constraints))
    );
  }

  getEntities() {
    const allEntitySubjects = this.getAllEntitySubjects();

    const allEntities = allEntitySubjects.map((subject) => subject.value);

    return filterOrderAndLimit(allEntities, this.constraints);
  }

  get() {
    const filteredEntities = this.getEntities();

    return {
      docs: filteredEntities.map((entity) => ({
        data: () => entity,
      })),
    };
  }
}
