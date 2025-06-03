import { Component, inject, OnInit } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { Router } from '@angular/router';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { TaskCompleteAlertComponent } from '../components/task-complete-alert/task-complete-alert.component';

@Component({
  selector: 'app-geolocation-page',
  templateUrl: 'geolocation.page.html',
  styleUrls: ['geolocation.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TaskCompleteAlertComponent,
  ],
})
export class GeolocationPage implements OnInit {
  timerService = inject(TimerService);
  router = inject(Router);

  completed = false;
  
  ngOnInit() {
    this.timerService.startTimer();
  }
  BackToDashboard() {
    this.router.navigate(['tabs/dashboard']);
  }
  NextTask() {
    this.router.navigate(['tabs/qr-code']);
  }
}
