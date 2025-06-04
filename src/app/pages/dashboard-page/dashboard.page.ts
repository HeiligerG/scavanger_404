import { Component, inject, OnInit } from '@angular/core';
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
  ],
})
export class DashboardPage implements OnInit {
  private router = inject(Router);

  runnerName: string = '';

  previousRuns = [
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' },
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' },
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' },
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
}
