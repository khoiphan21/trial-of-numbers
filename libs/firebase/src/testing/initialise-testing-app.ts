import { initializeApp } from '@firebase/app';
import { getFirebaseConfig } from '../lib/get-firebase-config';

export function initialiseTestingApp() {
  return initializeApp(getFirebaseConfig());
}
