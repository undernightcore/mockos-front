import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import JSONEditor from 'jsoneditor';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-response',
  templateUrl: './create-response.component.html',
  styleUrls: ['./create-response.component.scss'],
})
export class CreateResponseComponent implements AfterViewInit {
  @ViewChild('editor') editorElement!: ElementRef;
  editor?: JSONEditor;

  responseForm = new FormGroup({
    name: new FormControl('Default', [Validators.required]),
    status: new FormControl(200, [Validators.min(100), Validators.max(599)]),
    body: new FormControl('', [Validators.required]),
    enabled: new FormControl(true),
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
  }

  handleSave() {
    if (this.responseForm.invalid) return;
    console.log(this.responseForm.value);
  }
}
