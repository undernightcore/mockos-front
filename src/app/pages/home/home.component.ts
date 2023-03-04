import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isLogged?: boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.isLogged.subscribe((logged) => {
      this.isLogged = logged;
    });
  }
}
