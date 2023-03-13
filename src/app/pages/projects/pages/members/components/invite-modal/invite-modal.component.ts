import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.scss'],
})
export class InviteModalComponent {
  inviteEmail = new FormControl(this.email ?? '', [
    Validators.required,
    Validators.email,
  ]);

  constructor(
    public dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) private email?: string
  ) {}

  handleInvite() {
    this.inviteEmail.markAsTouched();
    if (this.inviteEmail.invalid) return;
    this.dialogRef.close(this.inviteEmail);
  }
}
