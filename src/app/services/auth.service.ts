import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { MessageInterface } from '../interfaces/message.interface';
import { TokenInterface } from '../interfaces/token.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  get token() {
    return localStorage.getItem('token') ?? '';
  }

  #setToken(value: string) {
    localStorage.setItem('token', value);
  }

  login(email: string, password: string) {
    return this.http
      .post<TokenInterface>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(tap((token) => this.#setToken(token.token)));
  }

  register(name: string, email: string, password: string) {
    return this.http.post<MessageInterface>(
      `${environment.apiUrl}/auth/register`,
      {
        name,
        email,
        password,
      }
    );
  }
}
