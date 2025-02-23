import { FirebaseResourceName, ImageUrl } from '@luna/definitions';
import { Observable } from 'rxjs';

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const FILE_LIMIT_ERROR = 'Files cannot exceed 50MB limit';

export const SEVEN_DAYS = 604800000; // in milliseconds

export interface UploadImageInput {
  file: File;
  resourceName: FirebaseResourceName;
}

export interface UploadTask {
  // Emits the upload completion percentage.
  percentageChanges$: Observable<number | undefined>;
  resume: () => void;
  pause: () => void;
  cancel: () => void;
  // resolve when upload completed and return download url
  complete: () => Promise<ImageUrl>;
}
