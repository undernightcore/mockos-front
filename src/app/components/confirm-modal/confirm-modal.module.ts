import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmModalComponent } from './confirm-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ConfirmModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  exports: [ConfirmModalComponent],
})
export class ConfirmModalModule {}
