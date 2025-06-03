import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('../dashboard-page/dashboard.page').then((m) => m.DashboardPage),
      },
      {
        path: 'geolocation',
        loadComponent: () =>
          import('../geolocation-page/geolocation.page').then((m) => m.GeolocationPage),
      },
      {
        path: '',
        redirectTo: '/tabs/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/dashboard',
    pathMatch: 'full',
  },
];
