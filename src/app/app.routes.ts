import { Routes } from '@angular/router';
import { Callback } from './features/auth/callback/callback';

export const routes: Routes = [
  {
    path: 'callback',
    component: Callback,
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
