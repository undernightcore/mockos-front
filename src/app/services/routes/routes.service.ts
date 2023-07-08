import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PaginatedResponseInterface } from '../../interfaces/paginated-response.interface';
import { RouteInterface } from '../../interfaces/route.interface';
import { CreateRouteInterface } from '../../interfaces/create-route.interface';
import { MessageInterface } from '../../interfaces/message.interface';
import { EnvService } from '../env/env.service';

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

  deleteRoute(routeId: number) {
    return this.httpClient.delete<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/routes/${routeId}`
    );
  }

  getRoutes(projectId: number, search?: string, page = 1, perPage = 50) {
    return this.httpClient.get<PaginatedResponseInterface<RouteInterface>>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`,
      { params: { ...(search ? { search } : {}), page, perPage } }
    );
  }

  createRoute(projectId: number, data: CreateRouteInterface) {
    return this.httpClient.post<RouteInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/routes`,
      data
    );
  }

  sortRoute(projectId: number, originRouteId: number, destRouteId: number) {
    return this.httpClient.post<MessageInterface>(
      `${this.envService.getEnv('apiUrl')}/projects/${projectId}/sort`,
      { origin: originRouteId, destination: destRouteId }
    );
  }
}
