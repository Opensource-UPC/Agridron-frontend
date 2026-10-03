import {Routes} from '@angular/router';

/**
 * Route tree for field management presentation views.
 */
export const fieldManagementRoutes: Routes = [
  {path: '', loadComponent: () => import('./components/farm-page/farm-page').then(m => m.FarmPage)},
  {path: 'new', loadComponent: () => import('./components/new-farm-form/new-farm-form').then(m => m.NewFarmForm)},
  {path: ':id/edit', loadComponent: () => import('./components/new-farm-form/new-farm-form').then(m => m.NewFarmForm)}
];