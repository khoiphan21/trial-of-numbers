import { AppEntity, UUID } from '@luna/definitions';
import { hash } from 'immutable';
import { ReplaySubject } from 'rxjs';
import { EntitiesObservableService } from '../entities-observable-service';

export function storeEntityInService<T extends AppEntity>(
  id: UUID,
  entity: T | undefined
) {
  const service = EntitiesObservableService.instance;

  const key = hash(id);

  if (!service.has(key)) {
    const subject = new ReplaySubject<T | undefined>(1);

    service.put(key, subject);
  }

  const storedSubject = service.getEntity(key) as ReplaySubject<T>;

  if (entity) storedSubject.next(entity);
}
