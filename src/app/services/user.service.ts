import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _runnerName = signal<string>('');
  
  get runnerName(): Signal<string> {
    return this._runnerName.asReadonly();
  }
  
  setRunnerName(name: string) {
    this._runnerName.set(name);
  }
}