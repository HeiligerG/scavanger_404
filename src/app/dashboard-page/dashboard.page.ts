import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [
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
  private alertController = inject(AlertController);
  private permissionService = inject(PermissionService);
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
    // Request both location and camera permissions
    const geoPermStatus = await Geolocation.requestPermissions();
    const camPermStatus = await Camera.requestPermissions();

    const locationGranted = geoPermStatus.location === 'granted';
    const cameraGranted = camPermStatus.camera === 'granted';

    if (locationGranted && cameraGranted) {
      // ✅ All permissions granted, go to geolocation page
      this.router.navigate(['/tabs/geolocation']);
    } else {
      // ❌ At least one permission denied, go to dashboard
      this.router.navigate(['/tabs/dashboard']);
    }

  } catch (err) {
    console.error('Error requesting permissions:', err);
      this.router.navigate(['/tabs/dashboard']);
  }
}
}
