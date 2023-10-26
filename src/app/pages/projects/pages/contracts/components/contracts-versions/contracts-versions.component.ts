import {Component, Inject, OnInit} from '@angular/core';
import { ContractsService } from '../../../../../../services/contracts/contracts.service';
import { ContractVersionInterface } from '../../../../../../interfaces/contract.interface';
import {ActivatedRoute, Router} from '@angular/router';
import { tap } from 'rxjs';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-contracts-versions',
  templateUrl: './contracts-versions.component.html',
  styleUrls: ['./contracts-versions.component.scss'],
})
export class ContractsVersionsComponent implements OnInit {
  contracts?: ContractVersionInterface[];
  maxContracts = 0;
  isFetching = false;

  constructor(
    private contractService: ContractsService,
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) private projectId: number
  ) {}

  ngOnInit() {
    this.#getContracts()
  }

  handlePageChange(page: number) {
    if (this.isFetching) return;
    this.#getContracts(page);
  }

  #getContracts(page = 1) {
    this.contractService
      .getContractVersions(this.projectId, page, 20)
      .pipe(
        tap({
          subscribe: () => (this.isFetching = true),
          finalize: () => (this.isFetching = false),
        })
      )
      .subscribe((contracts) => {
        this.maxContracts = contracts.meta.total;
        this.contracts =
          page === 1 || !this.contracts
            ? contracts.data
            : [...this.contracts, ...contracts.data];
      });
  }
}
