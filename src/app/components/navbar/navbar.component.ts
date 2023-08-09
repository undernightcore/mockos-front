import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogged? = false;
  languages = this.translateService.getLangs();
  subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router,
    public translateService: TranslateService
  ) {}

  ngOnInit() {
    this.subscription.add(
      this.authService.isLogged.subscribe((status) => {
        this.isLogged = status;
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  changeLanguage(language: string) {
    this.translateService.use(language);
    localStorage.setItem('lang', this.translateService.currentLang);
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  logIn() {
    this.router.navigate(['/auth', 'login']);
  }
}
