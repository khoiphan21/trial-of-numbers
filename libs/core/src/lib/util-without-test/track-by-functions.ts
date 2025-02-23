import { EntityWithId, EntityWithIdAndVersion } from '@luna/definitions';

export const trackById = (index: number, id: string) => id;

export const trackByEntityId = (index: number, entity: EntityWithId) =>
  entity.id;

export const trackByEntityIdAndVersion = (
  index: number,
  entity: EntityWithIdAndVersion
) => entity.id + entity._version;

export const trackForm = trackByEntityIdAndVersion;
export const trackRole = trackByEntityIdAndVersion;

export function trackEmailIndex(index: number, email: string) {
  return index + email;
}
