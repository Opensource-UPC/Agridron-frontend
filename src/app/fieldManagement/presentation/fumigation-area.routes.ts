import {Routes} from '@angular/router';

/**
 * Route tree for fumigation area presentation views.
 */
export const fumigationAreaRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/fumigation-area-list/fumigation-area-list').then(m => m.FumigationAreaList)
  },
  {path: 'new', loadComponent: () => import('./components/fumigation-area-form/fumigation-area-form').then(m => m.FumigationAreaForm)},
  {path: ':id/edit', loadComponent: () => import('./components/fumigation-area-form/fumigation-area-form').then(m => m.FumigationAreaForm)}
];