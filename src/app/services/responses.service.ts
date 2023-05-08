import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../interfaces/paginated-response.interface';
import { ResponseInterface } from '../interfaces/response.interface';
import { environment } from '../../environments/environment';
import { CreateResponseInterface } from '../interfaces/create-response.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { map, Observable } from 'rxjs';
import { ResponseModel } from '../models/response.model';

@Injectable({
  providedIn: 'root',
})
export class ResponsesService {
  constructor(private httpClient: HttpClient) {}

  getResponses(
    routeId: number,
    page = 1,
    perPage = 10
  ): Observable<PaginatedResponseInterface<ResponseModel>> {
    return this.httpClient
      .get<PaginatedResponseInterface<ResponseInterface>>(
        `${environment.apiUrl}/routes/${routeId}/responses`,
        { params: { page, perPage } }
      )
      .pipe(
        map((responses) => ({
          data: responses.data.map((response) => new ResponseModel(response)),
          meta: responses.meta,
        }))
      );
  }

  getResponse(responseId: number) {
    return this.httpClient
      .get<ResponseInterface>(`${environment.apiUrl}/responses/${responseId}`)
      .pipe(map((response) => new ResponseModel(response)));
  }

  createResponse(
    routeId: number,
    data: CreateResponseInterface | FormData,
    isFile: boolean
  ) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/routes/${routeId}/responses`,
      data,
      isFile ? { params: { isFile } } : undefined
    );
  }

  editResponse(
    responseId: number,
    data: CreateResponseInterface | FormData,
    isFile: boolean
  ) {
    return this.httpClient.put<MessageInterface>(
      `${environment.apiUrl}/responses/${responseId}`,
      data,
      isFile ? { params: { isFile } } : undefined
    );
  }

  deleteResponse(responseId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${environment.apiUrl}/responses/${responseId}`
    );
  }
}
