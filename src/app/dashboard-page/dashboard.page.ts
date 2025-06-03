import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent],
})
export class DashboardPage {
  router = inject(Router);

  goToGeolocation() {
    (document.activeElement as HTMLElement)?.blur();
    this.router.navigate(['/tabs/geolocation']);
  }
}
