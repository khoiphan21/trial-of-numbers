import { shouldMock } from './setup-for-testing';
import { mockFirebase } from '.';

import * as Mocks from './firestore-mock';
jest.mock('./firestore-mock', () => ({
  __esModule: true,
  ...(jest.requireActual('./firestore-mock') as any),
}));

describe('setup methods for testing', () => {
  it('should return the status of whether to mock the firestore', async () => {
    jest.clearAllMocks();

    const resetSpy = jest
      .spyOn(Mocks, 'resetFirestoreMock')
      .mockImplementation();

    expect(resetSpy).not.toHaveBeenCalled();

    mockFirebase(false);
    expect(shouldMock()).toBe(false);

    // should not call to reset if not mocking
    expect(resetSpy).not.toHaveBeenCalled();

    // should be true if given no argument
    mockFirebase();
    expect(shouldMock()).toBe(true);

    // should call to reset firestore if mocking
    expect(resetSpy).toHaveBeenCalled();
  });
});
