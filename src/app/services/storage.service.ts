import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { ScavengerData } from '../models/scavanger-data.mode';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly STORAGE_KEY = 'game_results';

  async saveGameData(data: ScavengerData): Promise<void> {
    const allData = await this.getAllGameData();
    allData.push(data);
    await Preferences.set({
      key: this.STORAGE_KEY,
      value: JSON.stringify(allData),
    });
  }
  async getAllGameData(): Promise<ScavengerData[]> {
    const result = await Preferences.get({ key: this.STORAGE_KEY });
    return result.value ? JSON.parse(result.value) : [];
  }

  async getLeaders(): Promise<ScavengerData[]> {
    const allData = await this.getAllGameData();

    const sorted = allData.sort((a, b) => {
      if (b.cookies !== a.cookies) {
        return b.cookies - a.cookies;
      }

      if (a.trash !== b.trash) {
        return a.trash - b.trash;
      }

      return a.totalTime - b.totalTime;
    });

    return sorted.slice(0, 5);
  }

  async clearStorage(): Promise<void> {
    await Preferences.clear();
  }
}
