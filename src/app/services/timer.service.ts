import { Injectable, computed, effect, signal, Signal } from '@angular/core';

interface TimeEntry {
  givenTime: number;
  actualTime: number;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timeMap: Map<string, TimeEntry> = new Map([
    ['GeoLocation', { givenTime: 300, actualTime: 0 }],
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

  getTimeForKey(key: string): number {
    const entry = this.timeMap.get(key);
    return entry ? entry.actualTime : 0;
  }

  getTotalTime(): number {
    let total = 0;
    for (const entry of this.timeMap.values()) {
      total += entry.actualTime;
    }
    return total;
  }

  private clearInterval(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  resetTimer() {
    this.clearInterval();
    this.countdown.set(0);
    this.startTimestamp = null;
  }

  skipTimer(key: string): void {
    if (!this.timeMap.has(key)) {
      console.warn(`Key "${key}" not found in timeMap.`);
      return;
    }

    const entry = this.timeMap.get(key)!;
    entry.actualTime = 0;
    this.timeMap.set(key, entry);

    this.clearInterval();
    this.countdown.set(0);
    this.startTimestamp = null;
  }

  getResultCounts(): { cookie: number; trash: number } {
    let cookie = 0;
    let trash = 0;

    for (const { actualTime, givenTime } of this.timeMap.values()) {
      if (actualTime === 0) {
        trash++;
      } else {
        const performance = actualTime / givenTime;
        if (performance <= 1.1) {
          cookie++;
        } else {
          trash++;
        }
      }
    }

    return { cookie, trash };
  }

  clearTimeMap(): void {
    this.timeMap.clear();
    this.timeMap.set('GeoLocation', { givenTime: 300, actualTime: 0 });
    this.timeMap.set('QrCode', { givenTime: 300, actualTime: 0 });
    this.timeMap.set('DistanceTracking', { givenTime: 300, actualTime: 0 });
    this.timeMap.set('DeviceStatus', { givenTime: 300, actualTime: 0 });
    this.resetTimer();
  }
}
