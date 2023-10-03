import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import SwaggerUI from 'swagger-ui';
import { ContractsService } from '../../../../services/contracts/contracts.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { load } from 'js-yaml';
import { MinimalContractInterface } from '../../../../interfaces/contract.interface';
import { debounceTime } from 'rxjs';
import {isValidJson} from "../../../../utils/string.utils";

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss'],
})
export class ContractsComponent implements AfterViewInit {
  @ViewChild('swagger') private swaggerElement?: ElementRef<HTMLDivElement>;
  projectId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

  swagger?: SwaggerUI;
  contract = new FormControl('');

  selectedLang = 'yaml';
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

      this.selectedLang = contract && isValidJson(contract.swagger) ? 'json' : 'yaml'

      this.contract.setValue(contract?.swagger ?? '');
    });
  }

  #handleContractChange() {
    this.contract.valueChanges.pipe(debounceTime(100)).subscribe(() => {
      this.parsedLocal = this.#parseContract(String(this.contract.value));
      this.areSameContracts = this.#calculateIfSameContracts();

      this.#recreateEditor();
    });
  }

  #recreateEditor() {
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
      } catch (e) {
        console.log(e);
        return {};
      }
    }
  }

  #calculateIfSameContracts() {
    return (
      JSON.stringify(this.parsedRemote ?? {}) ===
      JSON.stringify(this.parsedLocal ?? {})
    );
  }
}
