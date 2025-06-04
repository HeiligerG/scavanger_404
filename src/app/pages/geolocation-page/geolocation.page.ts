import { Component, inject, OnInit, signal, effect } from '@angular/core';
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
  readonly currentPosition = this.location.currentPosition;

  readonly timerService = inject(TimerService);
  readonly router = inject(Router);

  completed = false;
  nextRoute = '/qr-code';

    constructor() {
    effect(() => {
      const currentDistance = this.distance();
      if (currentDistance !== null) {
        this.checkRadius();
      }
    });
  }

  ngOnInit() {
    this.timerService.startTimer();
    this.location.startTracking();
  }

  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();
    this.location.stopTracking();

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
    this.location.stopTracking();
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }

  async checkRadius() {
   if ((this.distance() as number) <= 15) {
      this.completed = true;
      await this.location.stopTracking();
    }
  }

  getProximityMessage(): string {
    const dist = this.distance();
    if (dist === null) return 'Searching for your location...';
    
    if (dist <= 30) return '🎯 Perfect! You are within range!';
    if (dist <= 50) return '🔥 Very close! Keep going!';
    if (dist <= 100) return '👍 Getting closer!';
    if (dist <= 200) return '🚶 Walk towards the target';
    return '📍 Head towards your destination';
  }
}
