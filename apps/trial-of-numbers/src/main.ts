import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { attemptInitializeApp } from '@luna/firebase';

const { app, functions } = attemptInitializeApp();

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
