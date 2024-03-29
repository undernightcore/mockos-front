import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import {
  ContractInterface,
  ContractVersionInterface,
} from '../../interfaces/contract.interface';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ContractsService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getContract(projectId: number, version?: string) {
    return this.httpClient.get<ContractInterface | null>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/contracts${
        version ? `/${version}` : ''
      }`
    );
  }

  getContractVersions(projectId: number, page = 1, perPage = 10) {
    return this.httpClient.get<
      PaginatedResponseInterface<ContractVersionInterface>
    >(
      `${this.envService.getEnv(
        'apiUrl'
      )}/projects/${projectId}/contract-versions`,
      { params: { page, perPage } }
    );
  }

  updateContract(
    projectId: number,
    originalVersion: string | null,
    swagger: string
  ) {
    return this.httpClient.put<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/contracts`,
      { originalVersion, swagger }
    );
  }

  rollbackContract(projectId: number, version: string) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv(
        'apiUrl'
      )}/projects/${projectId}/contracts/rollback`,
      { version }
    );
  }
}
