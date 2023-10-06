import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ContractsService } from '../../../../../../services/contracts/contracts.service';
import AceDiff from 'ace-diff';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-yaml';
import 'ace-builds/src-noconflict/ext-searchbox';
import 'ace-builds/src-noconflict/theme-tomorrow_night_eighties';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import {EditorTypeEnum} from "../../../../../../interfaces/response-type.interface";

@Component({
  selector: 'app-compare-contracts',
  templateUrl: './compare-contracts.component.html',
  styleUrls: ['./compare-contracts.component.scss'],
})
export class CompareContractsComponent implements OnInit {
  @ViewChild('panels') panels?: ElementRef<HTMLDivElement>;

  editor?: AceDiff;

  remoteContract?: string;

  constructor(
    private contractsService: ContractsService,
    @Inject(MAT_DIALOG_DATA) private data: { projectId: number }
  ) {}

  ngOnInit() {
    this.#getContract();
  }

  #getContract() {
    this.contractsService
      .getContract(this.data.projectId)
      .subscribe((contract) => {
        this.remoteContract = contract?.swagger ?? '';
        this.#createEditor();
      });
  }

  #createEditor() {
    if (!this.panels) return;
    this.editor = new AceDiff({
      element: this.panels?.nativeElement,
      showConnectors: false,
      theme: 'ace/theme/tomorrow_night_eighties',
      left: { content: '', copyLinkEnabled: false },
      right: { content: this.remoteContract ?? '', editable: false, mode: EditorTypeEnum.JSON }
    });

    this.editor.getEditors().left.getSession().on('changeScrollTop', (scroll: string) => {
      this.editor?.getEditors().right.getSession().setScrollTop(parseInt(scroll) || 0)
    });

    this.editor.getEditors().left.setOptions({customScrollbar: true})
    this.editor.getEditors().right.setOptions({customScrollbar: true})
  }
}
