import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageInterface } from '../../interfaces/message.interface';
import { TokenInterface } from '../../interfaces/token.interface';
import { BehaviorSubject, tap } from 'rxjs';
import { EnvService } from '../env/env.service';
import { UpdateUserData, UserInterface } from '../../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient, private envService: EnvService) {}

  #isLogged = new BehaviorSubject<boolean>(Boolean(this.token));
  isLogged = this.#isLogged.asObservable();

  get token() {
    return localStorage.getItem('token') ?? '';
  }

  #setToken(value: string | null) {
    if (!value) {
      localStorage.removeItem('token');
    } else {
      localStorage.setItem('token', value);
    }
  }

  register(name: string, email: string, password: string) {
    return this.http.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/user/register`,
      {
        name,
        email,
        password,
      }
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<TokenInterface>(`${this.envService.getEnv('apiUrl')}/user/login`, {
        email,
        password,
      })
      .pipe(
        tap((token) => {
          this.#setToken(token.token);
          this.#isLogged.next(true);
        })
      );
  }

  logout() {
    this.#setToken(null);
    this.#isLogged.next(false);
  }

  getUser() {
    return this.http.get<UserInterface>(
      `${this.envService.getEnv('apiUrl')}/user`
    );
  }

  modifyUser(data: UpdateUserData) {
    return this.http.put<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/user`,
      data
    );
  }

  modifyEmail(email: string) {
    return this.http.put<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/user/email`,
      { email }
    );
  }
}
