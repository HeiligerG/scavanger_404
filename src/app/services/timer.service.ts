import { Injectable, computed, effect, signal, Signal } from '@angular/core';

interface TimeEntry {
  givenTime: number;
  actualTime: number;
}

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timeMap: Map<string, TimeEntry> = new Map([
    ['Geodata', { givenTime: 300, actualTime: 0 }],
    ['QrCode', { givenTime: 300, actualTime: 0 }],
    ['DistanceTracking', { givenTime: 300, actualTime: 0 }],
    ['DeviceStatus', { givenTime: 300, actualTime: 0 }],
  ]);

  private countdown = signal<number>(0);
  private intervalId: any = null;
  private startTimestamp: number | null = null;

  startTimer(duration: number = 300): void {
    if (this.intervalId) {
      console.warn('Timer already running');
      return;
    }

    this.countdown.set(duration);
    this.startTimestamp = performance.now();

    this.intervalId = setInterval(() => {
      const current = this.countdown();
      if (current <= 1) {
        this.countdown.set(0);
        this.clearInterval();
      } else {
        this.countdown.set(current - 1);
      }
    }, 1000);
  }

  endTimer(key: string): void {
    if (!this.timeMap.has(key)) {
      console.warn(`Key "${key}" not found in timeMap.`);
      return;
    }

    if (this.startTimestamp === null) {
      console.warn('Timer was not started.');
      return;
    }

    const end = performance.now();
    const durationSeconds = (end - this.startTimestamp) / 1000;

    const entry = this.timeMap.get(key)!;
    entry.actualTime = durationSeconds;
    this.timeMap.set(key, entry);

    this.clearInterval();
    this.countdown.set(0);
    this.startTimestamp = null;
  }

  getCountdown(): Signal<number> {
    return this.countdown.asReadonly();
  }

  getTimeMap(): Map<string, TimeEntry> {
    return this.timeMap;
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
