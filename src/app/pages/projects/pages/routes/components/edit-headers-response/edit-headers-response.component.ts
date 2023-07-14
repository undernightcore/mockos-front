import { Component, Inject, OnInit } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { HeadersService } from '../../../../../../services/headers/headers.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';
import { HeadersInterface } from '../../../../../../interfaces/headers.interface';
import { tap } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  CreateHeaderInterface,
  EditHeaderInterface,
} from '../../../../../../interfaces/create-header.interface';
import { openToast } from '../../../../../../utils/toast.utils';

@Component({
  selector: 'app-edit-headers-response',
  templateUrl: './edit-headers-response.component.html',
  styleUrls: ['./edit-headers-response.component.scss'],
})
export class EditHeadersResponseComponent implements OnInit {
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

  constructor(
    public dialogRef: DialogRef,
    private headersService: HeadersService,
    @Inject(MAT_DIALOG_DATA) private data: ResponseInterface
  ) {}

  ngOnInit() {
    this.getHeaders(1);
  }

  getHeaders(page: number, perPage = 20) {
    if (this.isFetchingHeaders) return;
    this.headersService
      .getHeaders(this.data.id, page, perPage)
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
    console.log(this.editingHeaderForm.value);
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
        this.getHeaders(1);
      });
  }

  createHeader() {
    if (this.createHeaderForm.invalid) return;
    const header = this.createHeaderForm.value as CreateHeaderInterface;
    this.headersService
      .createHeader(this.data.id, header)
      .subscribe(({ message }) => {
        this.#clearCreationForm();
        openToast(message, 'success');
      });
  }

  deleteHeader(headerId: number) {
    this.headersService.deleteHeader(headerId).subscribe(({ message }) => {
      openToast(message, 'success');
      this.getHeaders(1);
    });
  }

  #patchLocalHeader(headerId: number, { key, value }: CreateHeaderInterface) {
    const foundHeader = this.headers?.find(({ id }) => id === headerId);
    if (!foundHeader) return;
    foundHeader.key = key;
    foundHeader.value = value;
  }

  cancelEditing() {
    this.editingHeaderForm.reset();
  }

  #clearCreationForm() {
    this.createHeaderForm.reset();
  }

  trackByHeader(index: number, header: HeadersInterface) {
    return `${index}-${header.id}`;
  }
}
