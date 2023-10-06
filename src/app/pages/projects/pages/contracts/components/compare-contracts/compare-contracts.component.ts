import {
  Component,
  Inject,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractInterface } from '../../../../../../interfaces/contract.interface';

@Component({
  selector: 'app-compare-contracts',
  templateUrl: './compare-contracts.component.html',
  styleUrls: ['./compare-contracts.component.scss'],
})
export class CompareContractsComponent {
  originalModel = { code: this.data.originalModel.swagger, language: 'yaml'}
  modifiedModel = { code: this.data.modifiedModel, language: 'yaml'}

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: {
      projectId: number;
      modifiedModel: string;
      originalModel: ContractInterface;
    }
  ) {}
}
