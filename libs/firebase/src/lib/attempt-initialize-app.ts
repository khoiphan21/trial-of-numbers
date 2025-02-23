import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';
import { getStorage } from 'firebase/storage';
import { getFirebaseConfig } from './get-firebase-config';

export const attemptInitializeApp = () => {
  if (getApps().length === 0) {
    const app = initializeApp(getFirebaseConfig());
    const functions = getFunctions(app);
    return { app, functions };
  }
  return { app: getApps()[0], functions: getFunctions(getApps()[0]) };
};

export const getFirebaseDatabase = () => getFirestore();
export const getFirebaseStorage = () => getStorage();
