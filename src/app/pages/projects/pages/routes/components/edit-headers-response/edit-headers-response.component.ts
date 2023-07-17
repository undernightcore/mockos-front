import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { HeadersService } from '../../../../../../services/headers/headers.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';
import { HeadersInterface } from '../../../../../../interfaces/headers.interface';
import { filter, Subscription, tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreateHeaderInterface,
  EditHeaderInterface,
} from '../../../../../../interfaces/create-header.interface';
import { openToast } from '../../../../../../utils/toast.utils';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { calculateAmountToFetch } from '../../../../../../utils/page.utils';

@Component({
  selector: 'app-edit-headers-response',
  templateUrl: './edit-headers-response.component.html',
  styleUrls: ['./edit-headers-response.component.scss'],
})
export class EditHeadersResponseComponent implements OnInit, OnDestroy {
  headers?: HeadersInterface[];
  maxHeaders = 0;

  isFetchingHeaders = false;

  createHeaderForm = new FormGroup({
    key: new FormControl<string>('', [Validators.required]),
    value: new FormControl<string>('', [Validators.required]),
  });

  editingHeaderForm = new FormGroup({
    id: new FormControl<number | undefined>(undefined),
    key: new FormControl<string | undefined>(undefined, [Validators.required]),
    value: new FormControl<string | undefined>(undefined, [
      Validators.required,
    ]),
  });

  realtimeSubscription?: Subscription;

  constructor(
    public dialogRef: DialogRef,
    private headersService: HeadersService,
    private realtimeService: RealtimeService,
    @Inject(MAT_DIALOG_DATA) private responseId: number
  ) {}

  ngOnInit() {
    this.getHeaders(1);
    this.#listenOnChanges();
  }

  ngOnDestroy() {
    this.realtimeSubscription?.unsubscribe();
  }

  getHeaders(page: number, perPage = 20) {
    if (this.isFetchingHeaders) return;
    this.headersService
      .getHeaders(this.responseId, page, perPage)
      .pipe(
        tap({
          subscribe: () => (this.isFetchingHeaders = true),
          finalize: () => (this.isFetchingHeaders = false),
        })
      )
      .subscribe((headers) => {
        this.headers =
          page === 1
            ? headers.data
            : [...(this.headers ?? []), ...headers.data];
        this.maxHeaders = headers.meta.total;
      });
  }

  selectEditing(header: HeadersInterface) {
    this.editingHeaderForm.patchValue(header);
  }
  saveEditing() {
    if (this.editingHeaderForm.invalid) return;
    const { id, key, value } = this.editingHeaderForm
      .value as EditHeaderInterface;
    this.headersService
      .editHeader(id, { key, value })
      .subscribe(({ message }) => {
        openToast(message, 'success');
        this.#patchLocalHeader(id, { key, value });
        this.cancelEditing();
      });
  }

  createHeader() {
    if (this.createHeaderForm.invalid) return;
    const header = this.createHeaderForm.value as CreateHeaderInterface;
    this.headersService
      .createHeader(this.responseId, header)
      .subscribe(({ message }) => {
        this.#clearCreationForm();
        openToast(message, 'success');
      });
  }

  deleteHeader(headerId: number) {
    this.headersService.deleteHeader(headerId).subscribe(({ message }) => {
      openToast(message, 'success');
    });
  }

  cancelEditing() {
    this.editingHeaderForm.reset();
  }

  #patchLocalHeader(headerId: number, { key, value }: CreateHeaderInterface) {
    const foundHeader = this.headers?.find(({ id }) => id === headerId);
    if (!foundHeader) return;
    foundHeader.key = key;
    foundHeader.value = value;
  }

  #listenOnChanges() {
    this.realtimeSubscription = this.realtimeService
      .listenResponse(this.responseId)
      .pipe(filter((event) => event === 'headers'))
      .subscribe(() => {
        this.getHeaders(
          1,
          calculateAmountToFetch(this.headers?.length ?? 0, 20)
        );
      });
  }

  #clearCreationForm() {
    this.createHeaderForm.reset();
  }

  trackByHeader(index: number, header: HeadersInterface) {
    return `${index}-${header.id}`;
  }
}
