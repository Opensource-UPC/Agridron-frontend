import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./iam.routes').then(m => m.iamRoutes)
  },
  {
    path: 'farms',
    loadChildren: () =>
      import('../../fieldManagement/presentation/fieldManagement.routes').then(m => m.fieldManagementRoutes)
  },
  {
    path: '',
    redirectTo: 'auth/sign-in',
    pathMatch: 'full'
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound)
  },
];