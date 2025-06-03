import { Component } from '@angular/core';
import { Camera, CameraResultType } from '@capacitor/camera';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-qrcode-page',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class QrcodePage {
  imagePath?: string;

  async takePhoto() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
      });

      if (image.webPath) {
        // Use the image.webPath to display the image
        this.imagePath = image.webPath;
        console.log('Image URI:', image.webPath);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }
}
