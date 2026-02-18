import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { finalize, Subscription } from 'rxjs';
import { LIVE_MOCK_TEMPLATE } from '../../../../../../const/live-mock.const';
import { EditProcessorInterface } from '../../../../../../interfaces/edit-processor.interface';
import { ProcessorInterface } from '../../../../../../interfaces/processor.interface';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { openToast } from '../../../../../../utils/toast.utils';
import { BuildPromptComponent } from '../build-prompt/build-prompt.component';

@Component({
  selector: 'app-live-mock',
  templateUrl: './live-mock.component.html',
  styleUrls: ['./live-mock.component.scss'],
})
export class LiveMockComponent implements OnDestroy {
  responseSubscription?: Subscription;

  saving = false;

  liveMockForm = new FormGroup({
    enabled: new FormControl(false),
    code: new FormControl(LIVE_MOCK_TEMPLATE, [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      responseId: number;
      processor: ProcessorInterface | undefined;
    },
    public dialogRef: DialogRef,
    private responsesService: ResponsesService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {
    if (this.data.processor) {
      this.liveMockForm.patchValue({
        enabled: this.data.processor.enabled,
        code: this.data.processor.code,
      });
    }
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }

  handleSave() {
    const responseId = this.data.responseId;
    if (this.liveMockForm.invalid && responseId) return;

    this.saving = true;

    const processor = {
      enabled: this.liveMockForm.value.enabled,
      code: this.liveMockForm.value.code,
    } as EditProcessorInterface;

    this.responsesService
      .editProcessor(responseId, processor)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          openToast(
            this.translateService.instant('PAGES.ROUTES.LIVE_MOCK_EDITED'),
            'success'
          );
          this.dialogRef.close();
        },
        error: (error) => {
          const errorMessage = error.error.errors[0];
          this.#changeToCreateUnexpectedly(errorMessage);
        },
      });
  }

  handleBuildPrompt() {
    this.dialogService.open(BuildPromptComponent, {
      data: this.data.responseId,
    });
  }

  #changeToCreateUnexpectedly(error: string) {
    this.responseSubscription?.unsubscribe();

    openToast(error, 'error', 5000);
  }
}
