import {
  ErrorHandler,
  ApplicationConfig,
  provideZoneChangeDetection,
} from '@angular/core';
import { appRoutes } from './app.routes';
import { provideRouter } from '@angular/router';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment, ErrorHandlerService } from '@moofy/shared';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideClientHydration(),
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    {
      provide: FIREBASE_OPTIONS,
      useValue: environment.firebaseConfig,
    },
    {
      provide: ErrorHandler,
      useClass: ErrorHandlerService,
    }, provideAnimationsAsync(),
  ],
};
