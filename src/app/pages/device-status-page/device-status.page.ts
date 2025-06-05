import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { TimerService } from '../../services/timer.service';

import {
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonSpinner,
  IonText,
} from '@ionic/angular/standalone';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { FooterComponent } from '../../components/footer/footer.component';
import { TaskCompleteAlertComponent } from '../../components/task-complete-alert/task-complete-alert.component';

@Component({
  selector: 'app-device-status',
  templateUrl: './device-status.page.html',
  styleUrls: ['./device-status.page.scss'],
  imports: [
    IonContent,
    FooterComponent,
    IonGrid,
    IonRow,
    IonCol,
    IonText,
    IonSpinner,
    TaskCompleteAlertComponent,
  ],
})
export class DeviceStatusPage implements OnInit {
  timerService = inject(TimerService);
  storageService = inject(StorageService);
  userService = inject(UserService);
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
    const results = this.timerService.getResultCounts();
    this.storageService.saveGameData({
      name: this.userService.runnerName(),
      cookies: results.cookie,
      trash: results.trash,
      totalTime: this.timerService.getTotalTime(),
    });
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  finalSkip() {
    this.timerService.skipTimer('DeviceStatus');
    this.BlurActiveElement();
    this.clearBatteryPolling();
    this.completed = true;
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
