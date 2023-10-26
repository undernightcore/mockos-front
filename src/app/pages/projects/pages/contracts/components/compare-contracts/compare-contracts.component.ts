import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { ContractInterface } from '../../../../../../interfaces/contract.interface';
import { DialogRef } from '@angular/cdk/dialog';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-compare-contracts',
  templateUrl: './compare-contracts.component.html',
  styleUrls: ['./compare-contracts.component.scss'],
})
export class CompareContractsComponent {
  initialOriginalModel = {
    code: this.data.originalModel.swagger,
    language: 'yaml',
  };
  initialModifiedModel = { code: this.data.modifiedModel, language: 'yaml' };

  updatedModifiedModel = this.data.modifiedModel;

  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      projectId: number;
      modifiedModel: string;
      originalModel: ContractInterface;
    }
  ) {}
}
