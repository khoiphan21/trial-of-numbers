import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { shouldMock, StorageMock } from '../../testing';
import { createMockUploadTask } from './create-mock-upload-task';
import { MAX_FILE_SIZE, UploadImageInput, UploadTask } from './definition';
import { makeUploadTask } from './util';

export function uploadImageFile(input: UploadImageInput): UploadTask {
  const { resourceName, file } = input;

  if (shouldMock()) {
    StorageMock.instance.set(resourceName, file);
    return createMockUploadTask();
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File must be less than 50MB');
  }

  const fileRef = ref(getStorage(), resourceName);

  const task = uploadBytesResumable(fileRef, file, {
    contentEncoding: 'base64',
    contentType: 'image/webp',
  });

  return makeUploadTask(task);
}
