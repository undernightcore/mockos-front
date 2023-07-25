import { Component, Inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, Validators } from '@angular/forms';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { openToast } from '../../../../../../utils/toast.utils';

@Component({
  selector: 'app-duplicate-response',
  templateUrl: './duplicate-response.component.html',
  styleUrls: ['./duplicate-response.component.scss'],
})
export class DuplicateResponseComponent {
  name = new FormControl('', [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) private responseId: number,
    public dialogRef: DialogRef,
    private responseService: ResponsesService
  ) {}

  handleSave() {
    if (this.name.invalid) return;
    this.responseService
      .duplicateResponse(this.responseId, this.name.value as string)
      .subscribe(({ message }) => {
        openToast(message, 'success');
        this.dialogRef.close();
      });
  }
}
