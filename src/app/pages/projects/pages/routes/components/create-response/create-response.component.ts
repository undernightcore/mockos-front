import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from './interfaces/response-modal-data.interface';
import { CreateResponseInterface } from '../../../../../../interfaces/create-response.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { finalize, iif, Subscription } from 'rxjs';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { TranslateService } from '@ngx-translate/core';
import { CompareResponsesComponent } from '../compare-responses/compare-responses.component';
import { CreateResponseWithFileModel } from '../../../../../../models/create-response-with-file.model';
import { CreateResponseModel } from '../../../../../../models/create-response.model';
import {
  isValidJson,
  prettifyJson,
} from '../../../../../../utils/string.utils';
import { Ace, edit } from 'ace-builds';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/theme-kr_theme';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/ext-searchbox';
import { EditorTypeEnum } from '../../../../../../interfaces/response-type.interface';

@Component({
  selector: 'app-create-response',
  templateUrl: './create-response.component.html',
  styleUrls: ['./create-response.component.scss'],
})
export class CreateResponseComponent implements AfterViewInit, OnDestroy {
  @ViewChild('editor') editorElement!: ElementRef;
  editor?: Ace.Editor;
  responseSubscription?: Subscription;
  newChanges = false;

  selectedTab = this.fileInBack ? 1 : 0;
  selectedFile = this.data.selectedFile;

  saving = false;

  responseForm = new FormGroup({
    name: new FormControl(this.data.responseData?.name ?? 'Default', [
      Validators.required,
    ]),
    status: new FormControl(this.data.responseData?.status ?? 200, [
      Validators.required,
      Validators.min(100),
      Validators.max(599),
    ]),
    body: new FormControl(
      this.fileInBack ? '{}' : this.data.responseData?.body ?? '{}',
      [Validators.required]
    ),
    enabled: new FormControl(this.data.responseData?.enabled ?? true),
  });

  get isEditing() {
    return Boolean(this.data.responseData);
  }

  get fileInBack() {
    return this.data.responseData?.is_file
      ? this.data.responseData?.body
      : undefined;
  }

  get fileMode() {
    return (
      this.selectedTab === 1 && Boolean(this.selectedFile || this.fileInBack)
    );
  }

  get warningInvalidJson() {
    return (
      this.editor?.getOption('mode') === EditorTypeEnum.JSON &&
      !isValidJson(this.responseForm.controls.body.value || '{}')
    );
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponseModalDataInterface,
    public dialogRef: DialogRef,
    private responsesService: ResponsesService,
    private realtimeService: RealtimeService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  ngAfterViewInit() {
    this.editor = edit(this.editorElement.nativeElement, {
      mode: this.data.responseData?.editorType ?? EditorTypeEnum.JSON,
      theme: 'ace/theme/gruvbox',
    });
    this.editor.on('change', () => {
      this.responseForm.controls.body.setValue(
        this.editor?.getValue() as string
      );
    });
    this.editor.session.setValue(this.responseForm.controls.body.value ?? '');
    this.#listenToChanges();
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
  }

  handleSave() {
    if (this.responseForm.invalid && this.selectedTab === 0) return;
    const body = this.#prepareSaveBody();
    this.saving = true;
    iif(
      () => Boolean(this.data.responseData),
      this.responsesService.editResponse(
        this.data.responseData?.id as number,
        body,
        this.selectedTab === 1
      ),
      this.responsesService.createResponse(
        this.data.routeId,
        body,
        this.selectedTab === 1
      )
    )
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
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

  handleTabChange() {
    this.selectedFile = undefined;
  }

  compareChanges() {
    if (!this.data.responseData) return;
    this.dialogRef.close();
    this.data.responseData.mergeResponses({
      is_file: this.fileMode,
      body: this.fileMode
        ? this.selectedFile?.name ?? this.fileInBack
        : this.responseForm.value.body ?? undefined,
    });
    this.dialogService.open(CompareResponsesComponent, {
      closeOnNavigation: true,
      height: '90%',
      width: '70%',
      data: {
        routeId: this.data.routeId,
        responseData: this.data.responseData,
        selectedFile: this.selectedFile,
      },
      autoFocus: false,
      panelClass: 'mobile-fullscreen',
    });
  }

  prettifyJson() {
    this.responseForm.controls.body.setValue(
      prettifyJson(this.responseForm.value.body as string)
    );
    this.editor?.session.setValue(
      prettifyJson(this.responseForm.value.body as string)
    );
  }

  #listenToChanges() {
    if (!this.data.responseData) return;
    this.responseSubscription = this.realtimeService
      .listenResponse(this.data.responseData.id)
      .subscribe((event) => {
        if (event === 'deleted') {
          this.#changeToCreateUnexpectedly();
        } else if (event === 'updated') {
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

  #prepareSaveBody() {
    return this.selectedTab === 1
      ? new CreateResponseWithFileModel(
          new CreateResponseModel(
            this.responseForm.value as CreateResponseInterface
          ),
          this.selectedFile
        ).formData
      : new CreateResponseModel(
          this.responseForm.value as CreateResponseInterface
        );
  }
}
