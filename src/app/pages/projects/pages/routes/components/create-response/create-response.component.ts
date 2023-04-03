import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import JSONEditor from 'jsoneditor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jsonValidator } from '../../../../../../validators/json.validator';
import { ResponsesService } from '../../../../../../services/responses.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from './interfaces/response-modal-data.interface';
import { CreateResponseInterface } from '../../../../../../interfaces/create-response.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { iif, Subscription } from 'rxjs';
import { RealtimeService } from '../../../../../../services/realtime.service';
import { TranslateService } from '@ngx-translate/core';
import { CompareResponsesComponent } from '../compare-responses/compare-responses.component';

@Component({
  selector: 'app-create-response',
  templateUrl: './create-response.component.html',
  styleUrls: ['./create-response.component.scss'],
})
export class CreateResponseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editorElement!: ElementRef;
  editor?: JSONEditor;
  responseSubscription?: Subscription;
  newChanges = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponseModalDataInterface,
    public dialogRef: DialogRef,
    private responsesService: ResponsesService,
    private realtimeService: RealtimeService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  responseForm = new FormGroup({
    name: new FormControl(this.data.responseData?.name ?? 'Default', [
      Validators.required,
    ]),
    status: new FormControl(this.data.responseData?.status ?? 200, [
      Validators.required,
      Validators.min(100),
      Validators.max(599),
    ]),
    body: new FormControl(this.data.responseData?.body ?? '{}', [
      jsonValidator,
    ]),
    enabled: new FormControl(this.data.responseData?.enabled ?? true),
  });

  ngAfterViewInit() {
    this.editor = new JSONEditor(this.editorElement.nativeElement, {
      mode: 'code',
      mainMenuBar: false,
      onChange: () =>
        this.responseForm.controls.body.setValue(
          this.editor?.getText() as string
        ),
    });
    this.editor.setText(this.responseForm.controls.body.value ?? '');
    this.#listenToChanges();
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }

  handleSave() {
    if (this.responseForm.invalid) return;
    iif(
      () => Boolean(this.data.responseData),
      this.responsesService.editResponse(
        this.data.responseData?.id as number,
        this.responseForm.value as CreateResponseInterface
      ),
      this.responsesService.createResponse(
        this.data.routeId,
        this.responseForm.value as CreateResponseInterface
      )
    ).subscribe({
      next: (response) => {
        openToast(response.message, 'success');
        this.dialogRef.close();
      },
      error: (error) => {
        if (error.status !== 404) return;
        this.#changeToCreateUnexpectedly();
      },
    });
  }

  compareChanges() {
    if (!this.data.responseData) return;
    this.dialogRef.close();
    this.dialogService.open(CompareResponsesComponent, {
      closeOnNavigation: true,
      height: '90%',
      width: '70%',
      data: {
        routeId: this.data.routeId,
        responseData: {
          ...this.data.responseData,
          ...this.responseForm.value,
        },
      },
    });
  }

  #listenToChanges() {
    if (!this.data.responseData) return;
    this.responseSubscription = this.realtimeService
      .listenResponse(this.data.responseData.id)
      .subscribe((event) => {
        if (event === 'deleted') {
          this.#changeToCreateUnexpectedly();
        } else {
          this.newChanges = true;
        }
      });
  }

  #changeToCreateUnexpectedly() {
    this.responseSubscription?.unsubscribe();
    this.data.responseData = undefined;
    openToast(
      this.translateService.instant(
        'PAGES.ROUTES.RESPONSE_UNEXPECTEDLY_DELETED'
      ),
      'warning',
      5000
    );
  }
}
