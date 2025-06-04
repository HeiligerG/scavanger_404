import { Component, inject, OnInit } from '@angular/core';
import { TimerService } from '../../services/timer.service';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonSpinner
} from '@ionic/angular/standalone';
import { FooterComponent } from '../../components/footer/footer.component';
import { TaskCompleteAlertComponent } from "../../components/task-complete-alert/task-complete-alert.component";

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.page.html',
  styleUrls: ['./device-status.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FooterComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSpinner,
    TaskCompleteAlertComponent
],
})
export class DeviceStatusPage implements OnInit {
  timerService = inject(TimerService);
  router = inject(Router);

  completed = false;
  nextRoute = '/dashboard';

  private batteryCheckInterval: any;

  ngOnInit() {
    this.timerService.startTimer();
    this.startBatteryPolling();
  }
  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();

    this.router.navigate(['/dashboard']);
  }
  submitScavange() {
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  SkipTask() {
    this.timerService.skipTimer('DeviceStatus');
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }

  startBatteryPolling() {
    this.batteryCheckInterval = setInterval(async () => {
      try {
        const batteryInfo = await Device.getBatteryInfo();
        if (batteryInfo.isCharging) {
          this.clearBatteryPolling();
          this.completed = true;
        }
      } catch (error) {
        console.error('Failed to get battery info:', error);
      }
    }, 1000);
  }

  clearBatteryPolling() {
    if (this.batteryCheckInterval) {
      clearInterval(this.batteryCheckInterval);
      this.batteryCheckInterval = null;
    }
  }
}
