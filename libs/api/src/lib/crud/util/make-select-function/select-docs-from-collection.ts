import { onlyTruthyValues } from '@luna/core';
import { AppEntity, CollectionType } from '@luna/definitions';
import { QueryConstraint, selectDocs } from '@luna/firebase';
import { hash } from 'immutable';
import { Observable, ReplaySubject } from 'rxjs';
import { EntitiesObservableService } from '../entities-observable-service';
import { storeEntityInService } from './store-entity-in-service';

export const selectDocsFromCollection = <Entity extends AppEntity>(
  collectionType: CollectionType,
  ...conditions: QueryConstraint[]
): Observable<Entity[]> => {
  const service = EntitiesObservableService.instance;

  // key used for caching the query observable
  const key = hash(collectionType + JSON.stringify(conditions));

  const createAndStoreEntityObservable = () => {
    const docs$ = new ReplaySubject<Entity[]>(1);

    selectDocs<Entity>(collectionType, ...conditions).subscribe((docs) => {
      if (!docs) return;

      // emit the data
      docs$.next(docs);

      // store each individual doc as its own observable
      docs.filter(onlyTruthyValues).forEach((doc) => {
        storeEntityInService(doc.id, doc);
      });
    });

    service.put(key, docs$);
  };

  // If there's no cache for a query, create and store it
  if (!service.has(key)) {
    // store the new query
    createAndStoreEntityObservable();
  }

  const entityToReturn = service.get<Entity>(key);

  if (!entityToReturn) {
    throw Error('key not exist in observable map');
  }

  // Finally, just return the observable stored in the service
  return entityToReturn as any;
};
