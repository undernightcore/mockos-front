import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResponseInterface } from '../interfaces/paginated-response.interface';
import { ProjectInterface } from '../interfaces/project.interface';
import { CreateProjectInterface } from '../interfaces/create-project.interface';
import { MessageInterface } from '../interfaces/message.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  getProjects(page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<ProjectInterface>>(
      `${environment.apiUrl}/projects`,
      {
        params: { page, perPage },
      }
    );
  }

  getProject(id: number) {
    return this.httpClient.get<ProjectInterface>(
      `${environment.apiUrl}/projects/${id}`
    );
  }

  createProject(data: CreateProjectInterface) {
    return this.httpClient.post<ProjectInterface>(
      `${environment.apiUrl}/projects`,
      data
    );
  }

  editProject(id: number, data: CreateProjectInterface) {
    return this.httpClient.put<ProjectInterface>(
      `${environment.apiUrl}/projects/${id}`,
      data
    );
  }

  deleteProject(id: number) {
    return this.httpClient.delete<MessageInterface>(
      `${environment.apiUrl}/projects/${id}`
    );
  }
}
