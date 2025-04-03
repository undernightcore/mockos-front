import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, config } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  key = 'config';

  #showProjectsAsList = new BehaviorSubject<boolean>(false);
  showProjectsAsList$ = this.#showProjectsAsList.asObservable();

  #showResponsesAsList = new BehaviorSubject<boolean>(false);
  showResponsesAsList$ = this.#showResponsesAsList.asObservable();

  constructor() {
    this.#loadFromLocalStorage();
  }

  setShowProjectsAsList(value: boolean) {
    this.#showProjectsAsList.next(value);

    this.#saveToLocalStorage();
  }

  setShowResponsesAsList(value: boolean) {
    this.#showResponsesAsList.next(value);

    this.#saveToLocalStorage();
  }

  #loadFromLocalStorage() {
    const value = localStorage.getItem(this.key) || '{}';

    try {
      const { showProjectsAsList, showResponsesAsList } = JSON.parse(value);

      this.#showProjectsAsList.next(showProjectsAsList ?? false);
      this.#showResponsesAsList.next(showResponsesAsList ?? false);
    } catch (e) {
      console.error('Error parsing localStorage value:', e);
    }
  }

  #saveToLocalStorage() {
    localStorage.setItem(
      this.key,
      JSON.stringify({
        showProjectsAsList: this.#showProjectsAsList.value,
        showResponsesAsList: this.#showResponsesAsList.value,
      })
    );
  }
}
