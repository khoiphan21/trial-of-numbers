// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAMThluLnsSBoE9kFn0XMsWZUapyC3ssxM',
  authDomain: 'luna-academy-trial-of-numbers.firebaseapp.com',
  projectId: 'luna-academy-trial-of-numbers',
  storageBucket: 'luna-academy-trial-of-numbers.firebasestorage.app',
  messagingSenderId: '682755309913',
  appId: '1:682755309913:web:bf36b9135dbee021b84c48',
  measurementId: 'G-WQ1DPJ2XBL',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const FIREBASE_APP = app;
export const FIREBASE_ANALYTICS = analytics;
