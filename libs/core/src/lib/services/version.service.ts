import { UUID } from '@luna-academy-trial-of-numbers/definitions';
import { Set } from 'immutable';

export class VersionService {
  private static singleton: VersionService;

  private myVersions = Set();

  private constructor() {
    // more setup here
  }

  static get instance() {
    if (!VersionService.singleton) {
      VersionService.singleton = new VersionService();
    }

    return VersionService.singleton;
  }

  add(version: UUID) {
    this.myVersions = this.myVersions.add(version);
  }

  has(version: UUID): boolean {
    return this.myVersions.has(version);
  }

  remove(version: UUID) {
    this.myVersions = this.myVersions.delete(version);
  }

  reset() {
    this.myVersions.clear();
  }
}
