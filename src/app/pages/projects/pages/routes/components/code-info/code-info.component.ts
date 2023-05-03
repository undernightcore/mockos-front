import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from '../../../../../../services/auth.service';
import JSONEditor from 'jsoneditor';
import { environment } from '../../../../../../../environments/environment';
import { angularTemplate } from './templates/templates';

@Component({
  selector: 'app-code-info',
  templateUrl: './code-info.component.html',
  styleUrls: ['./code-info.component.scss'],
})
export class CodeInfoComponent implements AfterViewInit {
  token = this.authService.token;
  codeEditor?: JSONEditor;
  visible = false;

  @ViewChild('editor') editor!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    public dialogRef: DialogRef,
    private authService: AuthService
  ) {}

  ngAfterViewInit() {
    this.#initializeForm();
  }

  #initializeForm() {
    if (!this.editor) return;
    this.codeEditor = new JSONEditor(this.editor.nativeElement, {
      mode: 'code',
      onEditable: () => false,
      mainMenuBar: false,
    });
    this.setFwkConf('angular');
  }

  toggleVisibility() {
    this.visible = !this.visible;
  }

  setFwkConf(fwk: string) {
    const snippets = [
      {
        code: 'angular',
        action: () => angularTemplate(this.projectId, environment.apiUrl),
      },
    ];
    const snippet = snippets.find((code) => code.code === fwk);
    if (!snippet) return;
    this.codeEditor?.setText(snippet.action());
  }
}
