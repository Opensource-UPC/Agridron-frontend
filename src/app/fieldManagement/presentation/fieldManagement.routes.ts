import {Routes} from '@angular/router';

/**
 * Route tree for field management presentation views.
 */
export const fieldManagementRoutes: Routes = [
  {path: '', loadComponent: () => import('./components/farm-page/farm-page').then(m => m.FarmPage)}
];