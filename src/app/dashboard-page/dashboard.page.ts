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
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  imports: [
    CommonModule,
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
    console.log('Start button clicked, runner name:', this.runnerName);

    const checkPermissions = async () => {
      const status = await Camera.checkPermissions();
      if (status.camera !== 'granted') {
        await Camera.requestPermissions();
      }

      const requestLocation = async () => {
        const perm = await Geolocation.requestPermissions();

        const coords = await Geolocation.getCurrentPosition();
        console.log('Your location:', coords);
      };
    };
  }
}
