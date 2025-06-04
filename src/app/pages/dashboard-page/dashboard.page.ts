import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonList,
  IonLabel,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
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
  ],
})
export class DashboardPage implements OnInit {
  private router = inject(Router);

  runnerName = signal('');

  previousRuns = [
    { name: 'Jürg Jüngster', cookies: 2, trash: 2, totalTime: 112 },
    { name: 'Jürg Jüngster', cookies: 2, trash: 2, totalTime: 112 },
    { name: 'Jürg Jüngster', cookies: 2, trash: 2, totalTime: 112 },
  ];

  ngOnInit() {
    console.log('Dashboard initialized');
  }

  async onStartRun() {
    try {
      const geoPermStatus = await Geolocation.requestPermissions();
      const camPermStatus = await Camera.requestPermissions();

      const locationGranted = geoPermStatus.location === 'granted';
      const cameraGranted = camPermStatus.camera === 'granted';

      if (locationGranted && cameraGranted) {
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
