import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CustomValidators } from '../../validators/password-validator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  newUser?: boolean;
  authForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.newUser = data['newUser'] ?? true;
      if (!this.newUser) return;
      this.authForm.addControl(
        'name',
        new FormControl('', Validators.required)
      );
      this.authForm.addControl(
        'repeatPassword',
        new FormControl('', [Validators.required])
      );
      this.authForm.addValidators(
        CustomValidators.MatchValidator('password', 'repeatPassword')
      );
    });
  }

  handleAction() {
    if (this.newUser) {
      if (
        this.authForm.controls['password'].value !==
        this.authForm.controls['repeatPassword'].value
      )
        this.authForm.controls['repeatPassword'].invalid;
      this.authService
        .register(
          this.authForm.controls['name'].value,
          this.authForm.controls['email'].value,
          this.authForm.controls['password'].value
        )
        .subscribe();
    } else {
      this.authService
        .login(
          this.authForm.controls['email'].value,
          this.authForm.controls['password'].value
        )
        .subscribe();
    }
  }

  get passwordMatchError() {
    return this.authForm.getError('mismatch');
  }
}
