import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'farms',
    loadChildren: () =>
      import('./fieldManagement/presentation/fieldManagement.routes').then(m => m.fieldManagementRoutes)
  },
  {
    path: 'analytics',
    loadChildren: () =>
      import('./analyticsAndReporting/presentation/analyticsAndReporting.routes').then(m => m.analyticsAndReportingRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound)
  },
];