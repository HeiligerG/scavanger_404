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
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-distance-tracking',
  templateUrl: './distance-tracking.page.html',
  styleUrls: ['./distance-tracking.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    TaskCompleteAlertComponent,
    FooterComponent,
  ],
})
export class DistanceTrackingPage implements OnInit {
  timerService = inject(TimerService);
  router = inject(Router);

  completed = false;
  nextRoute = 'tabs/device-status';

  ngOnInit() {
    this.timerService.startTimer();
  }
  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();

    this.router.navigate(['tabs/dashboard']);
  }
  NextTask() {
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  SkipTask() {
    this.timerService.skipTimer('DistanceTracking');
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }
}
