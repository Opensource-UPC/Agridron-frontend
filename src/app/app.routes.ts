import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'auth/sign-in'
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./shared/presentation/views/home/home').then(m => m.Home)
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./iam/presentation/iam.routes').then(m => m.iamRoutes)
  },
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
    path: 'analytics',
    loadChildren: () =>
      import('./analyticsAndReporting/presentation/analyticsAndReporting.routes').then(m => m.analyticsAndReportingRoutes)
  },
  {
    path: 'drones',
    loadChildren: () =>
        import('./InventoryResourceManagement/presentation/inventory-and-resource-management.routes-interceptor').then(m => m.inventoryAndResourceManagementRoutes)
  },
  {
    path: '**',
    loadComponent: () =>
      import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound)
  },
];