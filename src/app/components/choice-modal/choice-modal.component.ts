import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './choice-modal.component.html',
  styleUrls: ['./choice-modal.component.scss'],
})
export class ChoiceModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string },
    public dialogRef: MatDialogRef<ChoiceModalComponent>
  ) {}
}
