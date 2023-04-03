import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import JSONEditor from 'jsoneditor';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { jsonValidator } from '../../../../../../validators/json.validator';
import { ResponsesService } from '../../../../../../services/responses.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModalDataInterface } from './interfaces/response-modal-data.interface';
import { CreateResponseInterface } from '../../../../../../interfaces/create-response.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { openToast } from '../../../../../../utils/toast.utils';
import { iif } from 'rxjs';

@Component({
  selector: 'app-create-response',
  templateUrl: './create-response.component.html',
  styleUrls: ['./create-response.component.scss'],
})
export class CreateResponseComponent implements AfterViewInit {
  @ViewChild('editor') editorElement!: ElementRef;
  editor?: JSONEditor;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ResponseModalDataInterface,
    public dialogRef: DialogRef,
    private responsesService: ResponsesService
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
    ).subscribe((response) => {
      openToast(response.message, 'success');
      this.dialogRef.close();
    });
  }
}
