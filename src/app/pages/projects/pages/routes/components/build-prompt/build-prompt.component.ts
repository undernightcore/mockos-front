import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { tap } from 'rxjs';
import { ResponsesService } from 'src/app/services/responses/responses.service';
import { openToast } from 'src/app/utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-build-prompt',
  templateUrl: './build-prompt.component.html',
  styleUrls: ['./build-prompt.component.scss'],
})
export class BuildPromptComponent {
  promptForm = new FormControl<string | null>(null, [Validators.required]);

  constructor(
    @Inject(MAT_DIALOG_DATA) private responseId: number,
    private dialogRef: DialogRef,
    private responsesService: ResponsesService,
    private clipboardService: Clipboard,
    private translateService: TranslateService
  ) {}

  handleCopyAndClose() {
    if (!this.promptForm.valid) return;

    this.responsesService
      .getResponsePrompt(this.responseId, this.promptForm.value ?? '')
      .pipe(
        tap(({ prompt }) => {
          this.clipboardService.copy(prompt);
          openToast(
            this.translateService.instant('PAGES.ROUTES.PROMPT_COPIED'),
            'success'
          );
          this.dialogRef.close();
        })
      )
      .subscribe();
  }

  handleClose() {
    this.dialogRef.close();
  }
}
