import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AppManagerService } from '../../services/app/app-manager.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  @HostListener('window:keydown.m')
  onMPress() {
    this.router.navigate(['/auth', 'login']);
  }

  constructor(appManager: AppManagerService, private router: Router) {
    appManager.setHeaderData({ hideHeader: true });
  }
}
