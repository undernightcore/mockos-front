import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const authenticatedRequest = request.clone({
      headers: request.headers.set(
        'Authorization',
        `Bearer ${this.authService.token}`
      ),
    });
    return next.handle(authenticatedRequest).pipe(
      catchError((error) => {
        if ([401, 403].includes(error.status)) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          Swal.fire({
            toast: true,
            position: 'bottom-right',
            icon: 'error',
            title: error.error.errors[0],
            showConfirmButton: false,
            timer: 2000,
          });
        }
        return throwError(() => error);
      })
    );
  }
}
