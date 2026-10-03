import {Routes} from '@angular/router';

/**
 * Route tree for parcel presentation views.
 */
export const parcelRoutes: Routes = [
  {path: '', loadComponent: () => import('./components/parcel-list/parcel-list').then(m => m.ParcelList)},
  {path: 'new', loadComponent: () => import('./components/parcel-form/parcel-form').then(m => m.ParcelForm)},
  {path: ':id/edit', loadComponent: () => import('./components/parcel-form/parcel-form').then(m => m.ParcelForm)},
  {path: ':id', loadComponent: () => import('./components/parcel-detail/parcel-detail').then(m => m.ParcelDetail)}
];