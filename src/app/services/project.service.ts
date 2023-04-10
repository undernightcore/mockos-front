import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PaginatedResponseInterface } from '../interfaces/paginated-response.interface';
import {
  ForkedProjectInterface,
  ProjectInterface,
} from '../interfaces/project.interface';
import { CreateProjectInterface } from '../interfaces/create-project.interface';
import { MessageInterface } from '../interfaces/message.interface';
import { MemberInterface } from '../interfaces/member.interface';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  getProjects(page = 1, perPage = 10) {
    return this.httpClient.get<
      PaginatedResponseInterface<ForkedProjectInterface>
    >(`${environment.apiUrl}/projects`, {
      params: { page, perPage },
    });
  }

  getMemberList(projectId: number, page = 1, perPage = 10) {
    return this.httpClient.get<PaginatedResponseInterface<MemberInterface>>(
      `${environment.apiUrl}/projects/${projectId}/members`,
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

  inviteToProject(projectId: number, email: string) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/projects/${projectId}/invite/${email}`,
      undefined
    );
  }

  forkProject(projectId: number, data: CreateProjectInterface) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/projects/${projectId}/fork`,
      data
    );
  }

  leaveProject(projectId: number) {
    return this.httpClient.post<MessageInterface>(
      `${environment.apiUrl}/projects/${projectId}/leave`,
      undefined
    );
  }
}
