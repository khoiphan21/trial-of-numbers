import { AppEntity } from '@luna/definitions';
import { Observable } from 'rxjs';

export class EntitiesObservableService {
  private static singleton: EntitiesObservableService;

  /**
   * Store the map of the current list of query that has been called once,
   */
  private entities = new Map<number, Observable<any>>();

  private testMode = false;

  private constructor() {
    // add more logic here
  }

  static get instance() {
    if (!EntitiesObservableService.singleton) {
      EntitiesObservableService.singleton = new EntitiesObservableService();
    }

    return EntitiesObservableService.singleton;
  }

  reset() {
    this.entities = new Map();
  }

  enableTestMode(mode = true) {
    this.testMode = mode;
  }

  /**
   * Check if a queries has caches ready
   *
   * @param key the key to check stored observables
   */
  has(key: number): boolean {
    if (this.testMode) {
      // never cache the observable during testing
      return false;
    }

    return this.entities.has(key);
  }

  /**
   * store caches for the new query
   *
   * @param model the model to initiate observables for
   */
  put<T extends AppEntity>(
    key: number,
    values$: Observable<T[] | T | undefined>
  ) {
    this.entities.set(key, values$);
  }

  /**
   * Retrieve ALL entities for a given model. E.g. all blocks for `Block`
   *
   * @param key the hash of the query
   */
  get<T extends AppEntity>(
    key: number
  ): Observable<T[] | undefined> | undefined {
    return this.entities.get(key);
  }

  /**
   * Retrieve the observable for a single entity of the given model.`
   *
   * @param key the hash of the entity - most likely `hash(id)`
   */
  getEntity<T extends AppEntity>(
    key: number
  ): Observable<T | undefined> | undefined {
    return this.entities.get(key);
  }
}
