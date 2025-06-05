import { Injectable, signal, computed } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

// TODO: Besseres Error handling
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  watchId = signal<string | null>(null);
  targetPosition = signal({ lat: 47.02750, lon: 8.30086 });
  currentPosition = signal<{ lat: number; lon: number } | null>(null);

  readonly distance = computed(() => {
    const current = this.currentPosition();
    const target = this.targetPosition();
    if (!current) return null;
    return this.getDistanceInMeters(
      current.lat,
      current.lon,
      target.lat,
      target.lon
    );
  });

  // TODO: Permission check vlt durch global definierte Funtkion
  async startTracking() {
    const id = await Geolocation.watchPosition({}, (pos, err) => {
      if (err) return;
      if (pos) {
        this.currentPosition.set({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      }
    });
    this.watchId.set(id);
  }

  async stopTracking() {
    const id = this.watchId();
    if (id !== null) {
      await Geolocation.clearWatch({ id: id });
      this.watchId.set(null);
      console.log('Tracking gestoppt');
    }
  }

  getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }
}
