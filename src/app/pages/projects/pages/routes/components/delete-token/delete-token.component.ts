import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-token',
  templateUrl: './delete-token.component.html',
  styleUrls: ['./delete-token.component.scss'],
})
export class DeleteTokenComponent {
  constructor(public dialogRef: MatDialogRef<any>) {}
}
