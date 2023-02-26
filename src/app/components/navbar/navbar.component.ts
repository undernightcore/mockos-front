import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isLogged = false;
  subscription = new Subscription();

  constructor(private authService: AuthService) {}

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
