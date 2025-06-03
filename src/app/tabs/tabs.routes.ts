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
          import('../dashboard-page/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'geolocation',
        loadComponent: () =>
          import('../geolocation-page/geolocation.page').then(
            (m) => m.GeolocationPage
          ),
      },
      {
        path: 'qr-code',
        loadComponent: () =>
          import('../qrcode-page/qrcode.page').then((m) => m.QrcodePage),
      },
      {
        path: 'device-status',
        loadComponent: () =>
          import('../device-status-page/device-status.page').then(
            (m) => m.DeviceStatusPage
          ),
      },
      {
        path: 'distance-tracking',
        loadComponent: () =>
          import('../distance-tracking-page/distance-tracking.page').then(
            (m) => m.DistanceTrackingPage
          ),
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
