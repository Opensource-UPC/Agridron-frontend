import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'farms',
    loadChildren: () =>
      import('./fieldManagement/presentation/fieldManagement.routes').then(m => m.fieldManagementRoutes)
  },
  {
    path: 'parcels',
    loadChildren: () =>
      import('./fieldManagement/presentation/parcel.routes').then(m => m.parcelRoutes)
  },
  {
    path: 'crops',
    loadChildren: () =>
      import('./fieldManagement/presentation/crop.routes').then(m => m.cropRoutes)
  },
  {
    path: 'fumigation-areas',
    loadChildren: () =>
      import('./fieldManagement/presentation/fumigation-area.routes').then(m => m.fumigationAreaRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound)
  },
];