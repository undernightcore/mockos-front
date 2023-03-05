import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoiceModalComponent } from './choice-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ChoiceModalComponent],
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  exports: [ChoiceModalComponent],
})
export class ChoiceModalModule {}
