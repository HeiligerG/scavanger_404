import {
  Component,
  inject,
  input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { TimerService } from '../../services/timer.service';

@Component({
  selector: 'app-task-complete-alert',
  templateUrl: './task-complete-alert.component.html',
})
export class TaskCompleteAlertComponent implements OnChanges {
  showAlert = input.required<boolean>();
  currentTask = input.required<string>();
  finalOne = input<boolean>(false);
  alertController = inject(AlertController);
  timerService = inject(TimerService);

  @Output() quitClicked = new EventEmitter<void>();
  @Output() continueClicked = new EventEmitter<void>();
  @Output() submitScavenge = new EventEmitter<void>();

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['showAlert']?.currentValue === true) {
      this.timerService.endTimer(this.currentTask());
      if (this.finalOne()) {
        await this.presentFinalAlert();
        return;
      }
      await this.presentAlert();
    }
  }

  private async presentAlert() {
    const alert = await this.alertController.create({
      header: 'You did it!!',
      subHeader: 'Your Time was:',
      message: this.formatTime(
        this.timerService.getTimeForKey(this.currentTask())
      ),
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

  private async presentFinalAlert() {
    const totalTime = this.timerService.getTotalTime();
    const reward = this.timerService.getResult();

    const message =
      `Total Time: ${this.formatTime(totalTime)}\n` + `Reward: ${reward}`;

    const alert = await this.alertController.create({
      header: 'Scavenge Complete!',
      subHeader: `Total Time: ${this.formatTime(totalTime)}`,
      message: `Reward: ${reward}`,
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
          text: 'Submit Scavenge',
          role: 'confirm',
          handler: () => {
            this.submitScavenge.emit();
          },
        },
      ],
    });

    await alert.present();
  }

  private formatTime(totalSeconds: number): string {
    if (isNaN(totalSeconds)) return 'Invalid time';

    const roundedSeconds = Math.floor(totalSeconds);
    const mins = Math.floor(roundedSeconds / 60);
    const secs = roundedSeconds % 60;

    return `${mins}m ${secs}s`;
  }
}
