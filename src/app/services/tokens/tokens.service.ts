import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EnvService } from '../env/env.service';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { TokensInterface } from '../../interfaces/tokens.interface';
import { MessageInterface } from '../../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class TokensService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getTokens(projectId: number, page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<TokensInterface>>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/tokens`,
      { params: { page, perPage } }
    );
  }

  createToken(projectId: number, name: string) {
    return this.httpClient.post<TokensInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/tokens`,
      { name }
    );
  }

  deleteToken(tokenId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/tokens/${tokenId}`
    );
  }
}
