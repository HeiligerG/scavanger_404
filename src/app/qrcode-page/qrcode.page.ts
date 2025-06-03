import { Component, inject } from '@angular/core';
import { TimerService } from '../services/timer.service';
import { Router } from '@angular/router';
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
} from '@ionic/angular/standalone';
import { TaskCompleteAlertComponent } from '../components/task-complete-alert/task-complete-alert.component';
import { FooterComponent } from '../components/footer/footer.component';

@Component({
  selector: 'app-qrcode-page',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    TaskCompleteAlertComponent,
    FooterComponent,
  ],
})
export class QrcodePage {
  timerService = inject(TimerService);
  router = inject(Router);

  completed = false;
  nextRoute = 'tabs/geolocation';

  qrResult?: string;
  message?: string;

  ngOnInit() {
    this.timerService.startTimer();
  }
  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();

    this.router.navigate(['tabs/dashboard']);
  }
  NextTask() {
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  SkipTask() {
    this.timerService.skipTimer('QrCode');
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }

  BlurActiveElement() {
    const active = document.activeElement as HTMLElement | null;
    active?.blur();
  }

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
          this.completed = true;
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
