import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ResponseModalDataInterface } from '../create-response/interfaces/response-modal-data.interface';
import JSONEditor from 'jsoneditor';
import { DialogRef } from '@angular/cdk/dialog';
import { RealtimeService } from '../../../../../../services/realtime.service';
import { ResponsesService } from '../../../../../../services/responses.service';
import { interval, Subscription } from 'rxjs';
import { DateTime } from 'luxon';
import { TranslateService } from '@ngx-translate/core';
import { CreateResponseComponent } from '../create-response/create-response.component';

@Component({
  selector: 'app-compare-responses',
  templateUrl: './compare-responses.component.html',
  styleUrls: ['./compare-responses.component.scss'],
})
export class CompareResponsesComponent implements AfterViewInit, OnDestroy {
  localChanges: ResponseInterface;
  localEditor?: JSONEditor;
  @ViewChild('localEditor') localEditorElement!: ElementRef;

  originChanges?: ResponseInterface;
  originEditor?: JSONEditor;
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
    this.localChanges = data.responseData as ResponseInterface;
  }

  ngAfterViewInit() {
    this.localEditor = new JSONEditor(this.localEditorElement.nativeElement, {
      mode: 'code',
      mainMenuBar: false,
      onChangeText: (value) => (this.localChanges.body = value),
    });
    this.originEditor = new JSONEditor(this.originEditorElement.nativeElement, {
      mode: 'code',
      mainMenuBar: false,
      onEditable: () => false,
    });
    this.localEditor.setText(this.data.responseData?.body as string);
    this.#getResponse();
  }

  selectResponse(response: ResponseInterface) {
    this.dialogRef.close();
    this.dialogService.open(CreateResponseComponent, {
      height: '90%',
      width: '70%',
      data: {
        closeOnNavigation: true,
        routeId: this.data.routeId,
        responseData: { ...this.data.responseData, ...response },
      },
    });
  }

  #getResponse() {
    if (!this.data.responseData) return;
    this.responsesService
      .getResponse(this.data.responseData.id)
      .subscribe((response) => {
        this.originChanges = response;
        this.originEditor?.setText(response.body);
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
