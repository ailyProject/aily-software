import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(
    [
      {
        path: '', component: HomeComponent, children: [
          { pathMatch: 'full', path: '', redirectTo: 'tts' },
          { path: 'tts', loadComponent: () => import('./software/tts/tts.component').then(m => m.TtsComponent) },
        ]
      },
    ]
  )]
};
