import { DecimalPipe } from '@angular/common';
import {
  Component,
  effect,
  inject,
  OnInit,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { Router } from '@angular/router';
import { LocationService } from 'src/app/services/location.service';
import { TimerService } from '../../services/timer.service';

import { IonContent } from '@ionic/angular/standalone';
import { FooterComponent } from '../../components/footer/footer.component';
import { TaskCompleteAlertComponent } from '../../components/task-complete-alert/task-complete-alert.component';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-distance-tracking',
  templateUrl: './distance-tracking.page.html',
  styleUrls: ['./distance-tracking.page.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    IonContent,
    TaskCompleteAlertComponent,
    FooterComponent,
    DecimalPipe,
  ],
})
export class DistanceTrackingPage implements OnInit {
  private location = inject(LocationService);
  readonly distance = this.location.distance;
  readonly currentPosition = this.location.currentPosition;

  totalDistance = signal<number>(0);
  previousPosition = signal<{ lat: number; lon: number } | null>(null);

  timerService = inject(TimerService);
  router = inject(Router);

  Math = Math;
  completed = false;
  nextRoute = '/device-status';

  constructor() {
    effect(() => {
      const current = this.currentPosition();
      const previous = this.previousPosition();

      if (current && previous) {
        const stepDistance = this.location.getDistanceInMeters(
          previous.lat,
          previous.lon,
          current.lat,
          current.lon
        );
        this.totalDistance.update((total) => total + stepDistance);
      }

      if (current) {
        this.previousPosition.set(current);
      }
    });

    effect(() => {
      if (this.totalDistance() >= 20) {
        this.completed = true;
        this.location.stopTracking();
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

  async SkipTask() {
    this.timerService.skipTimer('DistanceTracking');
    await Haptics.impact({ style: ImpactStyle.Medium });
    this.BlurActiveElement();
    this.location.stopTracking();
    this.router.navigate([this.nextRoute]);
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }
}
