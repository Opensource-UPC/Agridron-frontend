import {Routes} from '@angular/router';

/**
 * Route tree for analytics and reporting presentation views.
 */
export const analyticsAndReportingRoutes: Routes = [
  {path: '', loadComponent: () => import('./components/reports-page/reports-page').then(m => m.ReportsPage)},
  {path: 'reports/:id', loadComponent: () => import('./components/report-detail/report-detail').then(m => m.ReportDetail)}
];
