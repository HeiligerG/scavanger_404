import { Injectable, computed, effect, signal, Signal } from '@angular/core';

interface TimeEntry {
  givenTime: number;
  actualTime: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private timeMap: Map<string, TimeEntry> = new Map([
    ['GeoLocation', { givenTime: 300, actualTime: null }],
    ['QrCode', { givenTime: 300, actualTime: null }],
    ['DistanceTracking', { givenTime: 300, actualTime: null }],
    ['DeviceStatus', { givenTime: 300, actualTime: null }],
  ]);

  private countdown = signal<number>(0);
  private intervalId: any = null;
  private startTimestamp: number | null = null;

  startTimer(duration: number = 300): void {
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

    const entry = this.timeMap.get(key)!;

    if (entry.actualTime !== null) {
      console.warn(
        `Timer for "${key}" was already set (value: ${entry.actualTime}).`
      );
      return;
    }

    if (this.startTimestamp === null) {
      console.warn('Timer was not started.');
      return;
    }

    const end = performance.now();
    const durationSeconds = (end - this.startTimestamp) / 1000;

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
    return entry?.actualTime ?? 0;
  }

  getTotalTime(): number {
    let total = 0;
    for (const entry of this.timeMap.values()) {
      total += entry.actualTime ?? 0;
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

    if (entry.actualTime !== null) {
      console.warn(`Timer for "${key}" already completed or skipped.`);
      return;
    }

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
      if (actualTime === null) trash++;
      else if (actualTime === 0) trash++;
      else if (actualTime / givenTime <= 1.1) cookie++;
      else trash++;
    }

    return { cookie, trash };
  }

  clearTimeMap(): void {
    this.timeMap.set('GeoLocation', { givenTime: 300, actualTime: null });
    this.timeMap.set('QrCode', { givenTime: 300, actualTime: null });
    this.timeMap.set('DistanceTracking', { givenTime: 300, actualTime: null });
    this.timeMap.set('DeviceStatus', { givenTime: 300, actualTime: null });
    this.resetTimer();
  }
}
