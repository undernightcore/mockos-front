import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss'],
})
export class TokensComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    public dialogRef: DialogRef
  ) {}
}
