import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LandingGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate() {
    return this.authService.isLogged.pipe(
      take(1),
      map((isLogged) => !isLogged || this.router.createUrlTree(['/projects']))
    );
  }
}
