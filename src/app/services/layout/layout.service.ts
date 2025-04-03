import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  //TODO: Initial state should be loaded & saved when dismounted

  showProjectsAsList = new BehaviorSubject<boolean>(false);
  showProjectsAsList$ = this.showProjectsAsList.asObservable();

  showResponsesAsList = new BehaviorSubject<boolean>(false);
  showResponsesAsList$ = this.showResponsesAsList.asObservable();

  constructor() {}

  setShowProjectsAsList(value: boolean) {
    this.showProjectsAsList.next(value);
  }

  setShowResponsesAsList(value: boolean) {
    this.showResponsesAsList.next(value);
  }
}
