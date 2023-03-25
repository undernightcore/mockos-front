import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../interfaces/paginated-response.interface';
import { ResponseInterface } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { CreateResponseInterface } from '../interfaces/create-response.interface';
import { MessageInterface } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ResponsesService {
  constructor(private httpClient: HttpClient) {}

  getResponses(routeId: number, page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<ResponseInterface>>(
      `${environment.apiUrl}/routes/${routeId}/responses`,
      { params: { page, perPage } }
    );
  }

  getResponse(responseId: number) {
    return this.httpClient.get<ResponseInterface>(
      `${environment.apiUrl}/responses/${responseId}`
    );
  }

  createResponse(routeId: number, data: CreateResponseInterface) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/routes/${routeId}/responses`,
      data
    );
  }

  editResponse(responseId: number, data: CreateResponseInterface) {
    return this.httpClient.put<MessageInterface>(
      `${environment.apiUrl}/responses/${responseId}`,
      data
    );
  }

  deleteResponse(responseId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${environment.apiUrl}/responses/${responseId}`
    );
  }
}
