import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  newUser?: boolean;
  authForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  })
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.data.subscribe((data) => {
      this.newUser = data['newUser'] ?? true;
      if (!this.newUser) return;
      this.authForm.addControl('name', new FormControl('', Validators.required));
      this.authForm.addControl('repeatPassword', new FormControl('', Validators.required));
    });
  }

}
