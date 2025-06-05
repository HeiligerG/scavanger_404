import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { ScavengerData } from 'src/app/models/scavanger-data.mode';
import { StorageService } from 'src/app/services/storage.service';

import {
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonIcon,
} from '@ionic/angular/standalone';
import { UserService } from 'src/app/services/user.service';
import { addIcons } from 'ionicons';
import { refreshOutline } from 'ionicons/icons';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonList,
    IonLabel,
    IonIcon,
  ],
})
export class DashboardPage implements OnInit {
  constructor() {
    addIcons({
      refreshOutline,
    });
  }
  private router = inject(Router);
  private storageService = inject(StorageService);
  private userService = inject(UserService);

  runnerName = signal('');

  previousRuns = signal<ScavengerData[]>([]);

  ngOnInit() {
    this.runnerName.set(this.userService.runnerName());
    this.updateRuns();
  }

  public async updateRuns() {
    const data = await this.storageService.getLeaders();
    this.previousRuns.set(data);
  }

  async onStartRun() {
    try {
      const geoPermStatus = await Geolocation.requestPermissions();
      const camPermStatus = await Camera.requestPermissions();

      const locationGranted = geoPermStatus.location === 'granted';
      const cameraGranted = camPermStatus.camera === 'granted';

      if (locationGranted && cameraGranted) {
        this.userService.setRunnerName(this.runnerName());
        this.router.navigate(['/geolocation']);
      } else {
        this.router.navigate(['/dashboard']);
      }
    } catch (err) {
      console.error('Error requesting permissions:', err);
      this.router.navigate(['/dashboard']);
    }
  }

  formatTime(totalSeconds: number): string {
    if (isNaN(totalSeconds)) return 'Invalid time';

    const roundedSeconds = Math.floor(totalSeconds);
    const mins = Math.floor(roundedSeconds / 60);
    const secs = roundedSeconds % 60;

    return `${mins}m ${secs}s`;
  }
}
