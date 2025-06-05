import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from '@capacitor/barcode-scanner';
import { TimerService } from '../../services/timer.service';

import { IonButton, IonContent, IonIcon } from '@ionic/angular/standalone';
import { FooterComponent } from '../../components/footer/footer.component';
import { TaskCompleteAlertComponent } from '../../components/task-complete-alert/task-complete-alert.component';
import { addIcons } from 'ionicons';
import {
  qrCodeOutline,
  cameraOutline,
  checkmarkCircle,
  copyOutline,
  shareOutline,
  informationCircleOutline,
} from 'ionicons/icons';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-qrcode-page',
  templateUrl: './qrcode.page.html',
  styleUrls: ['./qrcode.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonButton,
    TaskCompleteAlertComponent,
    FooterComponent,
    IonIcon,
  ],
})
export class QrcodePage {
  constructor() {
    addIcons({
      qrCodeOutline,
      cameraOutline,
      checkmarkCircle,
      copyOutline,
      shareOutline,
      informationCircleOutline,
    });
  }

  timerService = inject(TimerService);
  router = inject(Router);

  completed = false;
  nextRoute = '/distance-tracking';

  qrResult?: string;
  message?: string;

  ngOnInit() {
    this.timerService.startTimer();
  }
  BackToDashboard() {
    this.timerService.resetTimer();
    this.BlurActiveElement();

    this.router.navigate(['/dashboard']);
  }
  NextTask() {
    this.BlurActiveElement();
    this.router.navigate([this.nextRoute]);
  }
  async SkipTask() {
    this.timerService.skipTimer('QrCode');
    await Haptics.impact({ style: ImpactStyle.Medium });
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
}
