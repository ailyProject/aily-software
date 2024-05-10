import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(
    [
      {
        path: '', component: HomeComponent, children: [
          { pathMatch: 'full', path: '', redirectTo: 'tts' },
          { path: 'tts', loadComponent: () => import('./software/tts/tts.component').then(m => m.TtsComponent) },
          { path: 'asr', loadComponent: () => import('./software/asr/asr.component').then(m => m.AsrComponent) },
        ]
      },
    ]
  ), provideNzI18n(en_US), importProvidersFrom(FormsModule), provideAnimationsAsync(), provideHttpClient()]
};
