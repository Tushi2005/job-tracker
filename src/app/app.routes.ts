import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { ApplicationsList } from './features/applications/applications-list/applications-list';
import { authGuard } from './core/guards/auth-guard';
import { ApplicationForm } from './features/applications/application-form/application-form';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'applications', component: ApplicationsList, canActivate: [authGuard] },
  { path: 'applications/new', component: ApplicationForm, canActivate: [authGuard] },
  { path: 'applications/:id/edit', component: ApplicationForm, canActivate: [authGuard] },
  { path: '', redirectTo: '/applications', pathMatch: 'full' },
  { path: '**', redirectTo: '/applications' },
];