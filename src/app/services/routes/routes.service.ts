import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import {
  FolderInterface,
  RouteInterface,
} from '../../interfaces/route.interface';
import { CreateRouteInterface } from '../../interfaces/create-route.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { EnvService } from '../env/env.service';
import { CreateFolderInterface } from '../../interfaces/create-folder.interface';

@Injectable({
  providedIn: 'root',
})
export class RoutesService {
  constructor(private httpClient: HttpClient, private envService: EnvService) {}

  getRoute(routeId: number) {
    return this.httpClient.get<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`
    );
  }

  editRoute(routeId: number, data: CreateRouteInterface) {
    return this.httpClient.put<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`,
      data
    );
  }

  editFolder(routeId: number, data: CreateFolderInterface) {
    return this.httpClient.put<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`,
      data
    );
  }

  deleteRoute(routeId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`
    );
  }

  getRoutes(
    projectId: number,
    folderId?: number,
    search?: string,
    page = 1,
    perPage = 50
  ) {
    return this.httpClient.get<
      PaginatedResponseInterface<RouteInterface | FolderInterface>
    >(`${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`, {
      params: {
        ...(search ? { search } : {}),
        ...(folderId ? { folderId } : {}),
        page,
        perPage,
      },
    });
  }

  createRoute(projectId: number, data: CreateRouteInterface) {
    return this.httpClient.post<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`,
      data
    );
  }

  createFolder(projectId: number, data: CreateFolderInterface) {
    return this.httpClient.post<RouteInterface>(
      `${this.envService.getEnv(
        'apiUrl'
      )}/projects/${projectId}/routes?isFolder=true`,
      data
    );
  }

  sortRoute(projectId: number, originRouteId: number, destRouteId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/sort`,
      { origin: originRouteId, destination: destRouteId }
    );
  }

  moveRoute(projectId: number, origin: number, destination: number | null) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/move`,
      { origin, destination }
    );
  }
}
