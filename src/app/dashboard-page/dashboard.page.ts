// dashboard.page.ts
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class DashboardPage implements OnInit {
  private alertController = inject(AlertController);
  private permissionService = inject(PermissionService);
  private router = inject(Router);
  
  runnerName: string = '';
  
  // Mock data für previous completions
  previousRuns = [
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' },
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' },
    { name: 'Jürg Jüngster', completions: '2x', difficulty: '🥉', level: '3x' }
  ];

  ngOnInit() {
    console.log('Dashboard initialized');
  }

  // Hauptmethode wenn "Start" Button gedrückt wird
  async onStartRun() {
    console.log('Start button clicked, runner name:', this.runnerName);
    
    // 1. Erst Name validieren
    if (!this.runnerName.trim()) {
      await this.showNameRequiredAlert();
      return;
    }

    // 2. Dann Permissions anfordern
    await this.requestPermissionsFlow();
  }

  // Alert wenn kein Name eingegeben wurde
  private async showNameRequiredAlert() {
    const alert = await this.alertController.create({
      header: 'Name Required',
      message: 'Please enter your name to start the run.',
      cssClass: 'custom-alert',
      buttons: ['OK']
    });
    await alert.present();
  }

  // Permission Flow starten
  private async requestPermissionsFlow() {
    console.log('Starting permission flow');
    
    const alert = await this.alertController.create({
      header: 'Permissions Required',
      subHeader: 'This app needs access to:',
      message: `
        <div style="text-align: left; margin: 16px 0;">
          <div style="margin-bottom: 12px;">
            <strong>📍 Location</strong><br>
            <span style="color: #666; font-size: 14px;">Track your running route and distance</span>
          </div>
          <div style="margin-bottom: 12px;">
            <strong>📷 Camera</strong><br>
            <span style="color: #666; font-size: 14px;">Take photos during your run</span>
          </div>
        </div>
      `,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          handler: () => {
            console.log('Permissions skipped by user');
            this.startRunWithoutPermissions();
          }
        },
        {
          text: 'Continue',
          role: 'confirm',
          handler: async () => {
            console.log('User agreed to permission request');
            await this.handlePermissionGrant();
          }
        }
      ]
    });

    await alert.present();
  }

  // Permissions nacheinander anfordern
  private async handlePermissionGrant() {
    try {
      console.log('Requesting permissions...');
      
      // Location Permission zuerst
      await this.requestLocationPermission();
      
      // Kurze Pause zwischen den Permission-Dialogen
      setTimeout(async () => {
        await this.requestCameraPermission();
      }, 800);
      
    } catch (error) {
      console.error('Permission flow error:', error);
      this.startRunWithoutPermissions();
    }
  }

  // Location Permission anfordern
  private async requestLocationPermission() {
    console.log('Requesting location permission...');
    
    try {
      const hasLocation = await this.permissionService.ensureLocationPermission();
      console.log('Location permission result:', hasLocation);
      
      if (!hasLocation) {
        await this.showPermissionSkippedAlert('Location');
      }
    } catch (error) {
      console.error('Location permission error:', error);
      await this.showPermissionSkippedAlert('Location');
    }
  }

  // Camera Permission anfordern
  private async requestCameraPermission() {
    console.log('Requesting camera permission...');
    
    try {
      const hasCamera = await this.permissionService.ensureCameraPermission();
      console.log('Camera permission result:', hasCamera);
      
      if (!hasCamera) {
        await this.showPermissionSkippedAlert('Camera');
      }
      
      // Nach allen Permissions -> Run starten
      await this.startRun();
      
    } catch (error) {
      console.error('Camera permission error:', error);
      await this.showPermissionSkippedAlert('Camera');
      await this.startRun();
    }
  }

  // Alert wenn Permission übersprungen wurde
  private async showPermissionSkippedAlert(permissionType: string) {
    const alert = await this.alertController.create({
      header: `${permissionType} Skipped`,
      message: `You can enable ${permissionType.toLowerCase()} permission later in settings if needed.`,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Continue',
          handler: () => {
            console.log(`${permissionType} permission skipped`);
          }
        }
      ]
    });
    await alert.present();
  }

  // Run starten mit Permission Status
  private async startRun() {
    console.log('Starting run...');
    
    try {
      // Check final permission status
      const permissions = await this.permissionService.checkPermissions();
      console.log('Final permission status:', permissions);
      
      const alert = await this.alertController.create({
        header: 'Ready to Run!',
        subHeader: `Good luck, ${this.runnerName}!`,
        message: `
          <div style="text-align: left;">
            <strong>Status:</strong><br>
            📍 Location: ${permissions.location ? '✅ Enabled' : '❌ Disabled'}<br>
            📷 Camera: ${permissions.camera ? '✅ Enabled' : '❌ Disabled'}
          </div>
        `,
        cssClass: 'custom-alert',
        buttons: [
          {
            text: 'Start Running!',
            role: 'confirm',
            handler: () => {
              this.navigateToRunningScreen();
            }
          }
        ]
      });
      
      await alert.present();
      
    } catch (error) {
      console.error('Error starting run:', error);
      this.navigateToRunningScreen();
    }
  }

  // Run ohne Permissions starten
  private startRunWithoutPermissions() {
    console.log('Starting run without permissions');
    this.navigateToRunningScreen();
  }

  // Navigation zur Running Screen
  private navigateToRunningScreen() {
    console.log(`Navigating to running screen for ${this.runnerName}`);
    
    // Hier navigierst du zu deiner Running Page
    this.router.navigate(['/running'], { 
      queryParams: { 
        name: this.runnerName,
        timestamp: Date.now()
      } 
    });
  }

  // Optional: Permission Status anzeigen
  async showPermissionStatus() {
    await this.permissionService.showPermissionStatus();
  }

  // Optional: Name Input Handler
  onNameChange(event: any) {
    this.runnerName = event.detail.value;
    console.log('Name changed to:', this.runnerName);
  }

  // Optional: Previous Run clicked
  onPreviousRunClicked(run: any) {
    console.log('Previous run clicked:', run);
  }

  // Optional: Plus Button
  onPlusButtonClicked() {
    console.log('Plus button clicked');
  }
}