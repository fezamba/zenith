import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app'; // Corrigido de 'App' para 'AppComponent'

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));