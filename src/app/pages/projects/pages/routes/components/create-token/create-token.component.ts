import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl, Validators } from '@angular/forms';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TokensComponent } from '../tokens/tokens.component';

@Component({
  selector: 'app-create-token',
  templateUrl: './create-token.component.html',
  styleUrls: ['./create-token.component.scss'],
})
export class CreateTokenComponent {
  nameControl = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(30),
  ]);

  constructor(
    private dialogRef: DialogRef,
    @Inject(MAT_DIALOG_DATA) private projectId: number,
    private tokensService: TokensService,
    private dialogService: MatDialog
  ) {}

  createToken() {
    this.nameControl.markAsTouched();
    if (this.nameControl.invalid) return;
    this.tokensService
      .createToken(this.projectId, String(this.nameControl.value))
      .subscribe(() => {
        this.goToTokensModal();
      });
  }

  goToTokensModal() {
    this.dialogRef.close();
    this.dialogService.open(TokensComponent, {
      data: this.projectId,
      height: '60%',
      width: '50%',
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
    });
  }
}
