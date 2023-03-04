import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

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
}
