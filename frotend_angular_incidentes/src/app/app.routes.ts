// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ListComponent } from './components/incident/list/list';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'incidentes',
    pathMatch: 'full'
  },
  {
    path: 'incidentes',
    component: ListComponent
  }
];