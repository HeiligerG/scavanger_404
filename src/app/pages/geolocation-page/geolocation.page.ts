import { Component, inject, OnInit, signal } from '@angular/core';
import { LocationService } from '../../services/location.service';
import { TimerService } from '../../services/timer.service';
import { Router } from '@angular/router';

import { TaskCompleteAlertComponent } from '../../components/task-complete-alert/task-complete-alert.component';
import { FooterComponent } from '../../components/footer/footer.component';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonText,
  IonCard,
  IonCardContent,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-geolocation-page',
  templateUrl: 'geolocation.page.html',
  styleUrls: ['geolocation.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonText,
    IonCard,
    IonCardContent,
    TaskCompleteAlertComponent,
    FooterComponent,
  ],
})

export class GeolocationPage implements OnInit {
  private location = inject(LocationService);

  readonly distance = this.location.distance;
  readonly target = this.location.targetPosition;

  readonly timerService = inject(TimerService);
  readonly router = inject(Router);

  completed = false;
  nextRoute = '/qr-code';

  ngOnInit() {
    this.timerService.startTimer();
    this.location.startTracking();
  }

  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();

    this.router.navigate(['/dashboard']);
  }

  NextTask() {
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }

  SkipTask() {
    this.timerService.skipTimer('GeoLocation');
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }


}
