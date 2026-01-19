import { Routes } from '@angular/router';
import { Callback } from './features/auth/callback/callback';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing').then((m) => m.Landing),
  },
  {
    path: 'callback',
    component: Callback,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: '**',
    redirectTo: '/',
    pathMatch: 'full',
  },
];
