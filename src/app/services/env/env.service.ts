import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvService {
  constructor() {}

  getEnv(key: string) {
    // Only way I can think for injecting env variables after compilation
    return (
      (window as any)['mockos-env']?.[key] ?? (environment as any)[key] ?? ''
    );
  }
}
