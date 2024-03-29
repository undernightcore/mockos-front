import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { ContractsService } from '../../../../services/contracts/contracts.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { load } from 'js-yaml';
import {
  ContractInterface,
  ContractVersionInterface,
  MinimalContractInterface,
} from '../../../../interfaces/contract.interface';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  of,
  Subscription,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { isValidJson, isValidYaml } from '../../../../utils/string.utils';
import { Ace, edit } from 'ace-builds';
import { EditorTypeEnum } from '../../../../interfaces/response-type.interface';
import Editor = Ace.Editor;

import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import { RealtimeService } from '../../../../services/realtime/realtime.service';
import { MatDialog } from '@angular/material/dialog';
import { CompareContractsComponent } from './components/compare-contracts/compare-contracts.component';
import { openToast } from '../../../../utils/toast.utils';
import { ContractsVersionsComponent } from './components/contracts-versions/contracts-versions.component';
import { ContractInfoComponent } from './components/contract-info/contract-info.component';
import { ContractInfoActionInterface } from './components/contract-info/interfaces/contract-info-action.interface';
import { ChoiceModalComponent } from '../../../../components/choice-modal/choice-modal.component';
import { isVersionGreater } from '../../../../utils/version.utils';
import { TranslateService } from '@ngx-translate/core';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements AfterViewInit, OnDestroy {
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

  realtimeSubscription?: Subscription;

  constructor(
    private contractsService: ContractsService,
    private activatedRoute: ActivatedRoute,
    private realtimeService: RealtimeService,
    private dialogService: MatDialog,
    private translateService: TranslateService
  ) {}

  ngAfterViewInit() {
    this.#handleContractChange();
    this.#handleLangChange();
    this.#listenOnRealtimeChanges();

    this.getInitialContract();
  }

  ngOnDestroy() {
    this.realtimeSubscription?.unsubscribe();
  }

  updateContract() {
    this.contractsService
      .updateContract(
        this.projectId,
        this.parsedRemote?.info?.version ?? null,
        this.contract.value ?? ''
      )
      .subscribe({
        next: (message) => {
          openToast(message.message, 'success');
        },
        error: (error) => {
          if (error.status !== 409) return;
          this.contractsService
            .getContract(this.projectId)
            .subscribe((contract) => this.#openMergeModal(contract));
        },
      });
  }

  getInitialContract() {
    this.contractsService.getContract(this.projectId).subscribe((contract) => {
      this.parsedRemote = contract
        ? this.#parseContract(contract?.swagger)
        : null;

      if (!this.editor) this.#recreateEditor(contract?.swagger);

      this.#setEditorValue(contract?.swagger ?? '');
    });
  }

  openVersionList() {
    this.dialogService
      .open(ContractsVersionsComponent, {
        panelClass: 'mobile-fullscreen',
        height: '60%',
        width: '40%',
        autoFocus: false,
        data: this.projectId,
      })
      .afterClosed()
      .pipe(filter((version) => version))
      .subscribe(({ version }: ContractVersionInterface) => {
        this.#openVersionInfo(version);
      });
  }

  #openVersionInfo(version: string) {
    this.dialogService
      .open(ContractInfoComponent, {
        panelClass: 'mobile-fullscreen',
        height: '80%',
        width: '70%',
        autoFocus: false,
        data: { projectId: this.projectId, version },
      })
      .afterClosed()
      .pipe(filter((event) => event))
      .subscribe((event: ContractInfoActionInterface) => {
        if (event.action === 'compare' && event.contract) {
          this.#openMergeModal(event.contract);
        } else if (event.action === 'rollback') {
          this.#openRollbackModal(event.contract);
        }
      });
  }

  #openRollbackModal(contract: ContractInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            'PAGES.CONTRACTS.ROLLBACK_TITLE',
            { version: contract.version }
          ),
          message: this.translateService.instant(
            'PAGES.CONTRACTS.ROLLBACK_MESSAGE',
            {
              author: contract.author?.name ?? '[deleted]',
              date: DateTime.fromISO(contract.created_at).toFormat(
                'yyyy-MM-dd'
              ),
              time: DateTime.fromISO(contract.created_at).toFormat('HH:mm'),
            }
          ),
        },
      })
      .afterClosed()
      .pipe(
        filter((accepted) => accepted),
        mergeMap(() =>
          this.contractsService.rollbackContract(
            this.projectId,
            contract.version
          )
        )
      )
      .subscribe(() => {
        this.getInitialContract();
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

  #listenOnRealtimeChanges() {
    this.realtimeSubscription = this.realtimeService
      .listenContract(this.projectId)
      .pipe(
        switchMap((event) =>
          this.contractsService
            .getContract(this.projectId)
            .pipe(map((contract) => ({ contract, event })))
        )
      )
      .subscribe(({ contract, event }) => {
        if (event === 'updated') {
          this.#checkIfAutoMerge(contract);
        }
      });
  }

  #checkIfAutoMerge(contract: ContractInterface | null) {
    const areCompatibleContracts =
      this.areSameContracts || this.#areCompatibleContracts(contract?.swagger);

    if (areCompatibleContracts) {
      this.parsedRemote = contract
        ? this.#parseContract(contract?.swagger)
        : null;

      this.#setEditorValue(contract?.swagger ?? '');
    } else {
      this.#openMergeModal(contract);
    }
  }

  #areCompatibleContracts(remoteContract?: string) {
    const parsedRemote = this.#parseContract(remoteContract ?? '');

    const newRemoteContract = {
      ...parsedRemote,
      info: { ...parsedRemote?.info, version: '' },
    };

    const localContract = {
      ...this.parsedLocal,
      info: { ...this.parsedLocal?.info, version: '' },
    };

    return JSON.stringify(newRemoteContract) === JSON.stringify(localContract);
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

    this.editor.on('change', () => {
      this.contract.setValue(this.editor?.getValue() ?? '');
    });
  }

  #recreateSwagger() {
    if (!this.swaggerElement) return;

    SwaggerUI({
      domNode: this.swaggerElement.nativeElement,
      spec: this.parsedLocal,
    });
  }

  #openMergeModal(originalContract: ContractInterface | null) {
    if (!originalContract) return;

    this.realtimeSubscription?.unsubscribe();

    this.dialogService
      .open(CompareContractsComponent, {
        height: '80%',
        width: '80%',
        panelClass: 'mobile-fullscreen',
        data: {
          projectId: this.projectId,
          modifiedModel: this.contract.value ?? '',
          originalModel: originalContract,
        },
      })
      .afterClosed()
      .subscribe((value?: string) => {
        this.#listenOnRealtimeChanges();
        if (!value) return;

        if (
          isVersionGreater(
            this.parsedRemote?.info.version ?? '',
            originalContract.version
          )
        ) {
          this.parsedRemote = originalContract
            ? this.#parseContract(originalContract?.swagger)
            : null;
        }

        this.#setEditorValue(value);
      });
  }

  #parseContract(value: string) {
    try {
      return JSON.parse(value);
    } catch {
      try {
        return load(value);
      } catch {
        return { info: { version: this.parsedLocal?.info.version } };
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
