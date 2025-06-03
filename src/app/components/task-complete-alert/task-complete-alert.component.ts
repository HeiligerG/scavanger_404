import {
  Component,
  inject,
  input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { AlertController } from '@ionic/angular';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-task-complete-alert',
  templateUrl: './task-complete-alert.component.html',
  styleUrls: ['./task-complete-alert.component.scss'],
})
export class TaskCompleteAlertComponent implements OnChanges {
  showAlert = input.required<boolean>();
  currentTask = input.required<string>();
  alertController = inject(AlertController);
  timerService = inject(TimerService);

  @Output() quitClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['showAlert']?.currentValue === true) {
      this.timerService.endTimer(this.currentTask());
      await this.presentAlert();
    }
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'You did it!!',
      subHeader: 'Your Time was:',
      message: this.timerService.getTimeForKey(this.currentTask()),
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'Quit',
          role: 'cancel',
          handler: () => {
            this.quitClicked.emit();
          },
        },
        {
          text: 'Continue',
          role: 'confirm',
          handler: () => {
            this.continueClicked.emit();
          },
        },
      ],
    });

    await alert.present();
  }
}
