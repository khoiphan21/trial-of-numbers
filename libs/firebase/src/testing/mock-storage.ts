import { UploadMetadata, UploadTask } from 'firebase/storage';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

type StorageMap = Map<string, File | string>;

/**
 * To store mock data uploaded using AngularFireStorageMock
 */
export class StorageMock {
  private static singleton: StorageMock;

  private storageMap: StorageMap = new Map<string, any>();

  private constructor() {
    //
  }

  static get instance() {
    if (!StorageMock.singleton) {
      StorageMock.singleton = new StorageMock();
    }

    return StorageMock.singleton;
  }

  set(key: string, value: any) {
    this.storageMap.set(key, value);
  }

  get(resouceName: string): any {
    return this.storageMap.get(resouceName);
  }

  delete(resouceName: string) {
    this.storageMap.delete(resouceName);
  }

  has(resouceName: string) {
    return this.storageMap.has(resouceName);
  }

  reset() {
    this.storageMap.clear();
  }
}

export class AngularFireStorageMock {
  private static singleton: AngularFireStorageMock;

  private constructor() {
    //
  }

  static get instance() {
    if (!AngularFireStorageMock.singleton) {
      AngularFireStorageMock.singleton = new AngularFireStorageMock();
    }

    return AngularFireStorageMock.singleton;
  }

  ref(path: string) {
    return {
      getDownloadURL() {
        return Promise.resolve(`download-url-of/${path}`);
      },
      put(data: string, metadata?: UploadMetadata | undefined): UploadTask {
        StorageMock.instance.set(path, { data, metadata });
        return createUploadTask();
      },
      putString(
        data: string,
        format?: string | undefined,
        metadata?: UploadMetadata | undefined
      ): UploadTask {
        StorageMock.instance.set(path, data);
        return createUploadTask();
      },
      delete(): Observable<any> {
        StorageMock.instance.delete(path);
        return of('deleted!!');
      },
    };
  }

  refFromURL(url: string) {
    return {
      getDownloadURL() {
        return of(url);
      },
      delete(): Observable<any> {
        StorageMock.instance.delete(url);
        return of('deleted!!');
      },
    };
  }

  upload(path: string, data: any, metadata?: UploadMetadata): UploadTask {
    StorageMock.instance.set(path, data);
    return createUploadTask();
  }
}

function createUploadTask(): any {
  return {
    percentageChanges: (): Observable<number> => of(0, 20, 40, 60, 80, 100),
    snapshotChanges: () => of('Uploaded!!').pipe(delay(100)),
    resume: () => false,
    pause: () => false,
    cancel: () => false,
    complete: () => {
      //
    },
  };
}
