import {Routes} from '@angular/router';

/**
 * Rutas de las vistas de inventario y recursos.
 */
export const inventoryAndResourceManagementRoutes: Routes = [
    {path: '', loadComponent: () => import('./components/drone-page/drone-page').then(m => m.DronePage)},
    {
        path: 'new', loadComponent: () =>
            import('./components/drone-form/drone-form')
                .then(m => m.DroneForm)
    },
    {
        path: 'nozzles', loadComponent: () =>
            import('./components/nozzle-page/nozzle-page')
                .then(m => m.NozzlePage)
    },
    {
        path: ':id', loadComponent: () =>
            import('./components/drone-detail/drone-detail')
                .then(m => m.DroneDetail)
    },

    {
        path: ':id/edit', loadComponent: () =>
            import('./components/drone-form/drone-form')
                .then(m=> m.DroneForm)
    },
    {
        path: ':id/maintenance', loadComponent: () =>
            import('./components/drone-maintenance-page/drone-maintenance-page')
                .then(m => m.MaintenancePage)
    },

];