import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ContractInterface } from '../../../../../../interfaces/contract.interface';
import { ContractsService } from '../../../../../../services/contracts/contracts.service';

@Component({
  selector: 'app-contract-info',
  templateUrl: './contract-info.component.html',
  styleUrls: ['./contract-info.component.scss'],
})
export class ContractInfoComponent implements OnInit {
  contract?: ContractInterface;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { projectId: number; version: string },
    private contractsService: ContractsService,
    public dialogRef: MatDialogRef<any>
  ) {}

  ngOnInit() {
    this.#getContract();
  }

  #getContract() {
    this.contractsService
      .getContract(this.data.projectId, this.data.version)
      .subscribe((contract) => {
        this.contract = contract ?? undefined;
      });
  }
}
