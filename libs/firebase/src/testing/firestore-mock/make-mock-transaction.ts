import { MockDocRef } from '../../util';
import { mockDeleteDoc } from './mock-delete-doc';
import { mockGetDoc } from './mock-get-doc';
import { mockSetDoc } from './mock-set-doc';
import { mockUpdateDoc } from './mock-update-doc';

export function makeMockTransaction(): any {
  return {
    set: (ref: MockDocRef, entity: any) => {
      mockSetDoc(ref.type, ref.id, entity);
    },
    update: (ref: MockDocRef, props: any) =>
      mockUpdateDoc(ref.type, ref.id, props),
    get: (ref: MockDocRef) => ({ data: () => mockGetDoc(ref.type, ref.id) }),
    delete: (ref: MockDocRef) => mockDeleteDoc(ref.type, ref.id),
  };
}
