import { Injectable } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  #isMobile = new BehaviorSubject(false);
  isMobile = this.#isMobile.asObservable();

  constructor(private breakpointObserver: BreakpointObserver) {
    this.#listenToMediaQuery();
  }

  #listenToMediaQuery() {
    this.breakpointObserver
      .observe(['(max-width: 1000px)'])
      .subscribe(({ matches }) => this.#isMobile.next(matches));
  }
}
