import { Component } from '@angular/core';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';

import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-qrcode-page',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon],
})
export class QrcodePage {
  qrResult?: string;
  message?: string;

  async scanQrCode() {
    try {
      const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.QR_CODE,
        scanInstructions: 'Align QR code in frame',
        scanButton: false,
        scanText: 'Scan QR Code',
        cameraDirection: 1,
        scanOrientation: 3,
      });

      if (ScanResult) {
        this.qrResult = ScanResult;
        console.log('Scanned QR Code:', ScanResult);

        if (ScanResult === 'M335@ICT-BZ') {
          this.runDummyFunction();
          this.message = '🎉 You did it!!';
        } else {
          this.message = '❌ Sorry, that is the wrong one';
        }
      }
    } catch (error) {
      console.error('QR Scan failed:', error);
      this.message = '⚠️ Scan failed';
    }
  }

  runDummyFunction() {
    console.log('✅ Dummy function triggered!');
  }
}
