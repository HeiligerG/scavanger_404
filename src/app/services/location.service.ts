import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  targetPosition = signal( { lat: 47.035, lon: 8.294 });
  currentPosition = signal<{ lat: number; lon: number } | null>(null);

  readonly distance = computed(() => {
    const current = this.currentPosition();
    const target = this.targetPosition();
    if (!current) return null;
    return getDistanceInMeters(current.lat, current.lon, target.lat, current.lon);
  });
}

function getDistanceInMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) ** 2 +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c); // in Metern
}