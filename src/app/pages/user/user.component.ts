import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { UpdateUserData } from '../../interfaces/user.interface';
import { openToast } from '../../utils/toast.utils';
import { finalize, tap } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  userForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  emailForm = new FormControl('', [Validators.required, Validators.email]);

  isFetching = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.#getUserData();
  }

  updateUserData() {
    this.userForm.markAllAsTouched();
    if (this.userForm.invalid) return;
    this.authService
      .modifyUser(this.userForm.value as UpdateUserData)
      .pipe(
        tap({
          subscribe: () => (this.isFetching = true),
          finalize: () => (this.isFetching = false),
        }),
        finalize(() => this.#getUserData())
      )
      .subscribe(({ message }) => {
        openToast(message, 'success');
      });
  }

  updateUserEmail() {
    this.emailForm.markAsTouched();
    if (this.emailForm.invalid) return;
    this.authService
      .modifyEmail(this.emailForm.value as string)
      .pipe(
        tap({
          subscribe: () => (this.isFetching = true),
          finalize: () => (this.isFetching = false),
        }),
        finalize(() => this.#getUserData())
      )
      .subscribe(({ message }) => {
        openToast(message, 'success', 4000);
      });
  }

  #getUserData() {
    this.authService
      .getUser()
      .pipe(
        tap({
          subscribe: () => (this.isFetching = true),
          finalize: () => (this.isFetching = false),
        })
      )
      .subscribe((user) => {
        this.userForm.patchValue(user);
        this.emailForm.setValue(user.email);
      });
  }
}
