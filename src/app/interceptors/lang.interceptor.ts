import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class LangInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let locale = localStorage.getItem('lang') || 'en';
    if (!locale) return next.handle(req);
    return next.handle(
      req.clone({
        setHeaders: { 'Accept-Language': locale },
      })
    );
  }
}
