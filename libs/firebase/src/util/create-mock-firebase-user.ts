/* eslint-disable @typescript-eslint/no-empty-function */
import { shortUuid } from '@luna/core';
import { FirebaseUser } from '../types';

const createNewMock = (): FirebaseUser => ({
  uid: shortUuid(),
  emailVerified: true,
  displayName: 'John Doe',
  phoneNumber: '12345',
  email: 'example@email.com',
  photoURL: 'foo.png',
  providerId: 'some-provider-id',
  isAnonymous: false,
  metadata: {} as any,
  providerData: [],
  refreshToken: 'some-refresh-token',
  tenantId: 'some-tenant-id',
  delete: async () => {},
  getIdToken: async () => 'some-id-token',
  getIdTokenResult: async () => ({} as any),
  reload: async () => {},
  toJSON: () => ({}),
});

let mockFirebaseUser: FirebaseUser = createNewMock();

export function resetFirebaseUser() {
  mockFirebaseUser = createNewMock();
}

export function createMockFirebaseUser(): FirebaseUser {
  return mockFirebaseUser;
}
