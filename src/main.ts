import {
  bootstrapApplication,
  provideClientHydration,
  withEventReplay,
} from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import localeIt from '@angular/common/locales/it';
import { registerLocaleData } from '@angular/common';
import { importProvidersFrom, LOCALE_ID, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';

// Import Firebase modules
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { firebaseConfig } from './firebase-config';
import { PrenotazioniService } from './app/services/prenotazioni.service';
import  { provideServiceWorker } from '@angular/service-worker';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
bootstrapApplication(AppComponent, {
  providers: [
    { provide: LOCALE_ID, useValue: 'it-IT' },
    provideRouter(routes),
    Calendar,
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule),

    // Firebase providers - ORDINE IMPORTANTE!
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => {
      try {
        const firestore = getFirestore();
        return firestore;
      } catch (e) {
        console.error('Error initializing Firestore', e);
        throw e;
      }
    }),
    provideAnalytics(() => {
      if (typeof window !== 'undefined') {
        return getAnalytics();
      }
      throw new Error('Analytics is only available in browser environment');
    }),

    PrenotazioniService, provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
  ],
});
registerLocaleData(localeIt);
