import {Routes} from '@angular/router';

/**
 * Route tree for crop presentation views.
 */
export const cropRoutes: Routes = [
  {path: '', loadComponent: () => import('./components/crop-list/crop-list').then(m => m.CropList)},
  {path: 'new', loadComponent: () => import('./components/crop-form/crop-form').then(m => m.CropForm)},
  {path: ':id/edit', loadComponent: () => import('./components/crop-form/crop-form').then(m => m.CropForm)}
];