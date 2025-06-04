import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/dashboard-page/dashboard.page').then(
            (m) => m.DashboardPage
          ),
      },
      {
        path: 'geolocation',
        loadComponent: () =>
          import('./pages/geolocation-page/geolocation.page').then(
            (m) => m.GeolocationPage
          ),
      },
      {
        path: 'qr-code',
        loadComponent: () =>
          import('./pages/qrcode-page/qrcode.page').then((m) => m.QrcodePage),
      },
      {
        path: 'device-status',
        loadComponent: () =>
          import('./pages/device-status-page/device-status.page').then(
            (m) => m.DeviceStatusPage
          ),
      },
      {
        path: 'distance-tracking',
        loadComponent: () =>
          import('./pages/distance-tracking-page/distance-tracking.page').then(
            (m) => m.DistanceTrackingPage
          ),
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
];
