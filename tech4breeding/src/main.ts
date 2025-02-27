/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Add `provideAnimations` to the list of providers
bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    ...appConfig.providers,
  ],
  
}).catch((err) => console.error(err));
