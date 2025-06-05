import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Device } from '@capacitor/device';
import { TimerService } from '../../services/timer.service';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';

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
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { ScavengerData } from 'src/app/models/scavanger-data.mode';

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
    const localBody: ScavengerData = {
      name: this.userService.runnerName(),
      cookies: results.cookie,
      trash: results.trash,
      totalTime: this.timerService.getTotalTime(),
      timestamp: new Date().toISOString(),
    };

    this.storageService.saveGameData(localBody);

    const body = `entry.1860183935=${encodeURIComponent(
      localBody.name
    )}&entry.564282981=${encodeURIComponent(
      localBody.cookies
    )}&entry.1079317865=${encodeURIComponent(
      localBody.trash
    )}&entry.985590604=${encodeURIComponent(localBody.totalTime)}`;

    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };

    this.postRun(body);
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  async finalSkip() {
    this.timerService.skipTimer('DeviceStatus');
    await Haptics.impact({ style: ImpactStyle.Medium });
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

  async postRun(body: any) {
    const url =
      'https://docs.google.com/forms/u/0/d/e/1FAIpQLSc9v68rbCckYwcIekRLOaVZ0Qdm3eeh1xCEkgpn3d7pParfLQ/formResponse';
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    const options = {
      url: url,
      headers: headers,
      data: body,
    };

    const response = await CapacitorHttp.post(options);
    console.log('RESPONSE STATUS POST', response.status);
  }
}
