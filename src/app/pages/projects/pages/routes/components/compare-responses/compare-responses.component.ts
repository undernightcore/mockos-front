import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from '../create-response/interfaces/response-modal-data.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { interval, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { TranslateService } from '@ngx-translate/core';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { Ace, edit } from 'ace-builds';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/ext-searchbox';
import { ResponseModel } from '../../../../../../models/response.model';

@Component({
  selector: 'app-compare-responses',
  templateUrl: './compare-responses.component.html',
  styleUrls: ['./compare-responses.component.scss'],
})
export class CompareResponsesComponent implements AfterViewInit, OnDestroy {
  localChanges: ResponseModel;
  localEditor?: Ace.Editor;
  localFile? = this.data.selectedFile;
  get localFileName() {
    return (
      this.localFile?.name ??
      (this.data.responseData?.is_file
        ? this.data.responseData.body
        : undefined)
    );
  }
  @ViewChild('localEditor') localEditorElement!: ElementRef;

  originChanges?: ResponseModel;
  originEditor?: Ace.Editor;
  get originFileName() {
    return this.originChanges?.is_file ? this.originChanges.body : undefined;
  }
  @ViewChild('originEditor') originEditorElement!: ElementRef;

  intervalSubscription?: Subscription;
  responseSubscription?: Subscription;

  updatedAgo?: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ResponseModalDataInterface,
    private dialogRef: DialogRef,
    private realtimeService: RealtimeService,
    private responsesService: ResponsesService,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {
    this.localChanges = data.responseData as ResponseModel;
  }

  ngAfterViewInit() {
    this.#getResponse();
  }

  keepLocal() {
    if (!this.originChanges) return;
    this.localChanges.mergeResponses({
      editorType: this.originChanges.editorType,
      ...(this.localFile ? { body: this.originFileName, is_file: true } : {}),
    });
    this.#returnToResponseModal({
      routeId: this.data.routeId,
      responseData: this.localChanges,
      selectedFile: this.localFile,
    });
  }

  keepOrigin() {
    if (!this.originChanges) return;
    this.#returnToResponseModal({
      routeId: this.data.routeId,
      responseData: this.originChanges,
    });
  }

  #returnToResponseModal(state: ResponseModalDataInterface) {
    this.dialogRef.close();
    this.dialogService.open(CreateResponseComponent, {
      height: '90%',
      width: '70%',
      closeOnNavigation: true,
      data: state,
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
    });
  }

  #buildForm() {
    this.localEditor = edit(this.localEditorElement.nativeElement, {
      mode: this.data.responseData?.editorType,
      theme: 'ace/theme/gruvbox',
    });
    this.localEditor.on('change', () => {
      this.localChanges.body = this.localEditor?.getValue() as string;
    });
    this.originEditor = edit(this.originEditorElement.nativeElement, {
      readOnly: true,
      mode: this.originChanges?.editorType,
      theme: 'ace/theme/gruvbox',
    });
    this.localEditor.session.setValue(this.data.responseData?.body as string);
    this.originEditor?.session.setValue(this.originChanges?.body as string);
  }

  #getResponse() {
    if (!this.data.responseData) return;
    this.responsesService
      .getResponse(this.data.responseData.id)
      .subscribe((response) => {
        this.originChanges = response;
        this.#buildForm();
        if (!this.responseSubscription) this.#listenToChanges();
        if (!this.intervalSubscription) this.#keepTimeUpdated();
      });
  }

  #listenToChanges() {
    if (!this.data.responseData) return;
    this.responseSubscription = this.realtimeService
      .listenResponse(this.data.responseData.id)
      .subscribe((event) => {
        if (event === 'deleted') return;
        this.#getResponse();
        this.#keepTimeUpdated();
      });
  }

  #keepTimeUpdated() {
    this.intervalSubscription?.unsubscribe();
    this.intervalSubscription = interval(1000).subscribe(() => {
      if (!this.originChanges) return;
      this.updatedAgo =
        DateTime.fromISO(this.originChanges.updated_at).toRelative({
          locale: this.translateService.currentLang,
        }) ?? undefined;
    });
  }

  ngOnDestroy() {
    this.responseSubscription?.unsubscribe();
    this.intervalSubscription?.unsubscribe();
  }
}
