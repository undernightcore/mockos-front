import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { ContractsService } from '../../../../services/contracts/contracts.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { load } from 'js-yaml';
import { MinimalContractInterface } from '../../../../interfaces/contract.interface';
import { debounceTime } from 'rxjs';
import { isValidJson, isValidYaml } from '../../../../utils/string.utils';
import { Ace, edit } from 'ace-builds';
import { EditorTypeEnum } from '../../../../interfaces/response-type.interface';
import Editor = Ace.Editor;

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements AfterViewInit {
  @ViewChild('swagger') private swaggerElement?: ElementRef<HTMLDivElement>;
  @ViewChild('editor') private editorElement?: ElementRef<HTMLDivElement>;

  projectId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  swagger?: SwaggerUI;
  editor?: Editor;
  contract = new FormControl('');

  selectedLang = new FormControl('json');
  languages = ['yaml', 'json'];

  parsedLocal?: MinimalContractInterface;
  parsedRemote?: MinimalContractInterface;

  areSameContracts = true;

  constructor(
    private contractsService: ContractsService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngAfterViewInit() {
    this.#handleContractChange();
    this.#handleLangChange();
    this.#getContract();
  }

  updateContract() {
    this.contractsService
      .updateContract(
        this.projectId,
        this.parsedRemote?.info?.version ?? null,
        this.contract.value ?? ''
      )
      .subscribe(() => {
        this.#getContract();
      });
  }

  #getContract() {
    this.contractsService.getContract(this.projectId).subscribe((contract) => {
      this.parsedRemote = contract
        ? this.#parseContract(contract?.swagger)
        : null;

      if (!this.editor) this.#recreateEditor(contract?.swagger);

      this.#setEditorValue(contract?.swagger ?? '');
    });
  }

  #handleContractChange() {
    this.contract.valueChanges.pipe(debounceTime(200)).subscribe((value) => {
      this.parsedLocal = this.#parseContract(String(value));

      this.#calculateIfSameContracts();
      this.#calculateCurrentLanguage();

      this.#recreateSwagger();
    });
  }

  #handleLangChange() {
    this.selectedLang.valueChanges.subscribe((value) => {
      this.editor?.session.setMode(
        value === 'json' ? EditorTypeEnum.JSON : EditorTypeEnum.YAML
      );
    });
  }

  #recreateEditor(content?: string) {
    if (!this.editorElement) return;
    this.editor = edit(this.editorElement.nativeElement, {
      mode:
        this.selectedLang.value === 'json'
          ? EditorTypeEnum.JSON
          : EditorTypeEnum.YAML,
      value: content,
      theme: 'ace/theme/tomorrow_night_eighties',
      customScrollbar: true,
    });

    this.editor.on('change', () =>
      this.contract.setValue(this.editor?.getValue() ?? '')
    );
  }

  #recreateSwagger() {
    if (!this.swaggerElement) return;

    SwaggerUI({
      domNode: this.swaggerElement.nativeElement,
      spec: this.parsedLocal,
    });
  }

  #parseContract(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      try {
        return load(value);
      } catch {
        return { info: { version: this.parsedLocal?.info.version }};
      }
    }
  }

  #setEditorValue(value: string) {
    this.editor?.session.setValue(value);
  }

  #calculateCurrentLanguage() {
    const type = this.contract.value
      ? isValidJson(this.contract.value)
        ? 'json'
        : isValidYaml(this.contract?.value)
        ? 'yaml'
        : this.selectedLang.value
      : this.selectedLang.value;

    this.selectedLang.setValue(type);
  }

  #calculateIfSameContracts() {
    this.areSameContracts =
      JSON.stringify(this.parsedRemote ?? {}) ===
      JSON.stringify(this.parsedLocal ?? {});
  }
}
