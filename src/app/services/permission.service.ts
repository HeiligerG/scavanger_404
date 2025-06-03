import { Injectable, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Camera } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

export interface PermissionResult {
  camera: boolean;
  location: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private alertController = inject(AlertController);

  async checkPermissions(): Promise<PermissionResult> {
    try {
      const [cameraPerms, locationPerms] = await Promise.all([
        Camera.checkPermissions(),
        Geolocation.checkPermissions()
      ]);

      return {
        camera: cameraPerms.camera === 'granted',
        location: locationPerms.location === 'granted'
      };
    } catch (error) {
      console.error('Error checking permissions:', error);
      return { camera: false, location: false };
    }
  }

  async requestCameraPermission(): Promise<boolean> {
    try {
      const result = await Camera.requestPermissions();
      return result.camera === 'granted';
    } catch (error) {
      console.error('Camera permission error:', error);
      return false;
    }
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const result = await Geolocation.requestPermissions();
      return result.location === 'granted';
    } catch (error) {
      console.error('Location permission error:', error);
      return false;
    }
  }

  async requestPermissions(): Promise<PermissionResult> {
    const currentPerms = await this.checkPermissions();
    
    if (currentPerms.camera && currentPerms.location) {
      return currentPerms;
    }

    const alert = await this.alertController.create({
      header: 'Permissions Required',
      subHeader: 'This app needs access to:',
      message: '📍 Location: Track your running route and distance\n\n📷 Camera: Take photos during your run',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Not Now',
          role: 'cancel',
          handler: () => {
            console.log('Permissions denied');
          }
        },
        {
          text: 'Allow',
          role: 'confirm',
          handler: async () => {
            return await this.requestBothPermissions();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    
    if (result.role === 'confirm') {
      return await this.checkPermissions();
    } else {
      return currentPerms;
    }
  }

  private async requestBothPermissions(): Promise<void> {
    const currentPerms = await this.checkPermissions();
    
    if (!currentPerms.camera) {
      await this.requestCameraPermission();
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    if (!currentPerms.location) {
      await this.requestLocationPermission();
    }
  }

  async ensureCameraPermission(): Promise<boolean> {
    const perms = await this.checkPermissions();
    if (perms.camera) return true;

    const alert = await this.alertController.create({
      header: 'Camera Permission',
      message: 'Camera access is needed to take photos.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Allow',
          handler: async () => {
            return await this.requestCameraPermission();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role !== 'cancel';
  }

  async ensureLocationPermission(): Promise<boolean> {
    const perms = await this.checkPermissions();
    if (perms.location) return true;

    const alert = await this.alertController.create({
      header: 'Location Permission',
      message: 'Location access is needed to find nearby services.',
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Allow',
          handler: async () => {
            return await this.requestLocationPermission();
          }
        }
      ]
    });

    await alert.present();
    const result = await alert.onDidDismiss();
    return result.role !== 'cancel';
  }

  async showPermissionStatus(): Promise<void> {
    const perms = await this.checkPermissions();
    
    const cameraStatus = perms.camera ? '✅ Granted' : '❌ Denied';
    const locationStatus = perms.location ? '✅ Granted' : '❌ Denied';
    
    const alert = await this.alertController.create({
      header: 'Permission Status',
      message: `
        📷 Camera: ${cameraStatus}<br>
        📍 Location: ${locationStatus}
      `,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Request Missing',
          handler: async () => {
            if (!perms.camera || !perms.location) {
              await this.requestPermissions();
            }
          }
        },
        {
          text: 'Close'
        }
      ]
    });

    await alert.present();
  }
}