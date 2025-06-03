import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from '@ionic/angular/standalone';
import { TaskCompleteAlertComponent } from "../components/task-complete-alert/task-complete-alert.component";
import { TimerService } from '../services/timer.service';
@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, TaskCompleteAlertComponent],
})
export class DashboardPage {

  timerService = inject(TimerService);
  showAlert = false;
}
