import { Component, EventEmitter, input, Output } from '@angular/core';
import {
  IonFooter,
  IonButtons,
  IonButton,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  imports: [IonButtons, IonButton, IonFooter, IonToolbar],
})
export class FooterComponent {
  finalOne = input<boolean>(false);
  @Output() skipTask = new EventEmitter<void>();
  @Output() backToDashboard = new EventEmitter<void>();

  SkipTask() {
    this.skipTask.emit();
  }

  BackToDashboard() {
    this.backToDashboard.emit();
  }
}
