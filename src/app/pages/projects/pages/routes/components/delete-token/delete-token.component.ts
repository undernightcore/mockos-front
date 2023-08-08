import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { TokensService } from '../../../../../../services/tokens/tokens.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TokensComponent } from '../tokens/tokens.component';

@Component({
  selector: 'app-delete-token',
  templateUrl: './delete-token.component.html',
  styleUrls: ['./delete-token.component.scss'],
})
export class DeleteTokenComponent {
  constructor(
    public dialogRef: DialogRef,
    private tokensService: TokensService,
    private dialogService: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    private data: { tokenId: number; projectId: number }
  ) {}

  deleteToken() {
    this.tokensService
      .deleteToken(this.data.tokenId)
      .subscribe(({ message }) => {
        openToast(message, 'success');
        this.goToTokensModal()
      });
  }


  goToTokensModal() {
    this.dialogService.open(TokensComponent, {
      data: this.data.projectId,
      height: '60%',
      width: '50%',
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
    });
    this.dialogRef.close();
  }
}
