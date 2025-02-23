import { AppEntity, CollectionType, UUID } from '@luna/definitions';
import { selectDoc } from '@luna/firebase';
import { hash } from 'immutable';
import { Observable, of, ReplaySubject } from 'rxjs';
import { EntitiesObservableService } from '../entities-observable-service';

export const makeEntitySelectFunction = <Entity extends AppEntity>(
  collectionType: CollectionType
) => {
  const service = EntitiesObservableService.instance;

  return (id: UUID): Observable<Entity | undefined> => {
    const key = hash(id);

    if (!id) {
      return of(undefined);
    }

    if (!service.has(key)) {
      // create and store the entity observable
      const doc = new ReplaySubject<Entity | undefined>(1);

      selectDoc<Entity>(collectionType, id).subscribe((entity) =>
        doc.next(entity)
      );

      service.put(key, doc);
    }

    const entityToReturn = service.getEntity<Entity>(key);

    return entityToReturn ?? of(undefined);
  };
};
