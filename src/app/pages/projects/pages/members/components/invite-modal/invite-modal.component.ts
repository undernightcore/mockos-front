import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
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
    public dialogRef: MatDialogRef<InviteModalComponent>,
    @Inject(MAT_DIALOG_DATA) private email?: string
  ) {}

  handleInvite() {
    this.inviteEmail.markAsTouched();
    if (this.inviteEmail.invalid) return;
    this.dialogRef.close(this.inviteEmail.value);
  }
}
