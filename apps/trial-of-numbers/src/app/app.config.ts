import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';

import { FIREBASE_APP } from '@luna-academy-trial-of-numbers/firebase';
import { getFirestore } from 'firebase/firestore';

const app = FIREBASE_APP;
getFirestore(app);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
  ],
};
