import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { AuthService } from '../../../../../../services/auth/auth.service';
import { angularTemplate } from './templates/templates';
import { Ace, edit } from 'ace-builds';
import 'ace-builds/src-noconflict/theme-gruvbox';
import 'ace-builds/src-noconflict/mode-json';
import { EnvService } from '../../../../../../services/env/env.service';

@Component({
  selector: 'app-code-info',
  templateUrl: './code-info.component.html',
  styleUrls: ['./code-info.component.scss'],
})
export class CodeInfoComponent implements AfterViewInit {
  token = this.authService.token;
  codeEditor?: Ace.Editor;
  visible = false;

  @ViewChild('editor') editor!: ElementRef;

  constructor(
    @Inject(MAT_DIALOG_DATA) public projectId: number,
    public dialogRef: DialogRef,
    private authService: AuthService,
    private envService: EnvService
  ) {}

  ngAfterViewInit() {
    this.#initializeForm();
  }

  #initializeForm() {
    if (!this.editor) return;
    this.codeEditor = edit(this.editor.nativeElement, {
      readOnly: true,
      mode: 'ace/mode/json',
      theme: 'ace/theme/gruvbox',
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
        action: () =>
          angularTemplate(this.projectId, this.envService.getEnv('apiUrl')),
      },
    ];
    const snippet = snippets.find((code) => code.code === fwk);
    if (!snippet) return;
    this.codeEditor?.session.setValue(snippet.action());
  }
}
