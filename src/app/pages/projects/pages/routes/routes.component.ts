import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes.service';
import {
  HttpMethods,
  RouteInterface,
} from '../../../../interfaces/route.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateRouteInterface } from '../../../../interfaces/create-route.interface';
import { ChoiceModalComponent } from '../../../../components/choice-modal/choice-modal.component';
import { RealtimeService } from '../../../../services/realtime.service';
import { finalize, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsesService } from '../../../../services/responses.service';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { CreateResponseComponent } from './components/create-response/create-response.component';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../../../interfaces/create-project.interface';
import { ProjectService } from '../../../../services/project.service';
import { CodeInfoComponent } from './components/code-info/code-info.component';
import { ResponseModel } from '../../../../models/response.model';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  routes?: RouteInterface[];
  responses?: ResponseModel[];

  maxRoutes = 0;
  maxResponses = 0;

  selectedRoute?: FormGroup;
  projectId?: number;
  editingTitle = false;

  #isFetchingRoutes = false;
  #isFetchingResponses = false;

  projectSubscription?: Subscription;
  routeSubscription?: Subscription;
  responseSubscription?: Subscription;

  constructor(
    private routesService: RoutesService,
    private projectsService: ProjectService,
    private responsesService: ResponsesService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private dialogService: MatDialog,
    private realtimeService: RealtimeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.getRoutes(1);
      this.#listenToProjectChanges();
    });
  }

  ngOnDestroy() {
    this.projectSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
    this.responseSubscription?.unsubscribe();
  }

  getRoutes(page: number, perPage = 20) {
    if (this.projectId === undefined || this.#isFetchingRoutes) return;
    this.#isFetchingRoutes = true;
    this.routesService
      .getRoutes(this.projectId, undefined, page, perPage)
      .pipe(finalize(() => (this.#isFetchingRoutes = false)))
      .subscribe((routes) => {
        this.routes =
          page === 1 ? routes.data : [...(this.routes ?? []), ...routes.data];
        this.maxRoutes = routes.meta.total;
      });
  }

  getResponses(page: number, perPage = 20) {
    if (this.selectedRoute === undefined || this.#isFetchingResponses) return;
    this.#isFetchingResponses = true;
    this.responsesService
      .getResponses(this.selectedRoute.value.id, page, perPage)
      .pipe(finalize(() => (this.#isFetchingResponses = false)))
      .subscribe((responses) => {
        this.responses =
          page === 1
            ? responses.data
            : [...(this.responses ?? []), ...responses.data];
        this.maxResponses = responses.meta.total;
      });
  }

  selectRoute(route: RouteInterface) {
    this.editingTitle = false;
    this.#setRouteDataToForm(route);
    this.#listenToRouteChanges(route.id);
    this.getResponses(1);
  }

  selectMethod(method: HttpMethods) {
    this.selectedRoute?.controls['method'].setValue(method);
    this.updateRoute();
  }

  handleSort(event: CdkDragDrop<any>) {
    if (!this.routes || this.projectId === undefined) return;
    const previousState = [...this.routes];
    moveItemInArray(this.routes, event.previousIndex, event.currentIndex);
    this.routesService
      .sortRoute(
        this.projectId,
        previousState[event.previousIndex].id,
        previousState[event.currentIndex].id
      )
      .subscribe({
        next: (result) => {
          openToast(result.message, 'success');
        },
        error: () => {
          this.routes = previousState;
        },
      });
  }

  updateRoute() {
    if (!this.selectedRoute || this.selectedRoute.invalid) return;
    this.editingTitle = false;
    this.routesService
      .editRoute(this.selectedRoute.value.id, this.selectedRoute.value)
      .subscribe({
        next: (newRoute) => {
          this.selectedRoute?.setValue(newRoute);
          openToast(
            this.translateService.instant('PAGES.ROUTES.UPDATED_SUCCESSFULLY', {
              route: newRoute.name,
            }),
            'success'
          );
        },
        error: () => {
          const oldRoute = this.routes?.find(
            (route) => route.id === this.selectedRoute?.value.id
          );
          if (oldRoute) this.selectedRoute?.setValue(oldRoute);
        },
      });
  }

  openCreateModal(retryData?: CreateRouteInterface) {
    this.dialogService
      .open(CreateRouteComponent, {
        closeOnNavigation: true,
        width: '500px',
        data: retryData,
      })
      .afterClosed()
      .subscribe((data: CreateRouteInterface | undefined) => {
        if (!data || this.projectId === undefined) return;
        this.routesService.createRoute(this.projectId, data).subscribe({
          next: (newRoute) => {
            openToast(
              this.translateService.instant(
                'PAGES.ROUTES.CREATED_SUCCESSFULLY',
                {
                  route: newRoute.name,
                }
              ),
              'success'
            );
          },
          error: () => {
            this.openCreateModal(data);
          },
        });
      });
  }

  openCodeModal(projectId?: number) {
    if (!projectId) return;
    this.dialogService.open(CodeInfoComponent, {
      data: projectId,
      height: '80%',
      width: '70%',
    });
  }

  openForkModal(project?: CreateProjectInterface) {
    if (!this.projectId) return;
    const message = this.translateService.instant(
      'PAGES.ROUTES.FORKING_PROJECT'
    );
    this.dialogService
      .open(ProjectModalComponent, {
        data: { message, project },
        closeOnNavigation: true,
      })
      .afterClosed()
      .subscribe((newProject?: CreateProjectInterface) => {
        if (!newProject) return;
        this.projectsService
          .forkProject(this.projectId!, newProject)
          .subscribe({
            next: (data) => {
              openToast(data.message, 'success');
              this.router.navigate(['/projects']);
            },
            error: () => {
              this.openForkModal(newProject);
            },
          });
      });
  }

  openCreateResponseModal(responseData?: ResponseInterface) {
    if (!this.selectedRoute) return;
    this.dialogService.open(CreateResponseComponent, {
      closeOnNavigation: true,
      height: '90%',
      width: '70%',
      data: { routeId: this.selectedRoute.value.id, responseData },
    });
  }

  openDeleteModal(route: RouteInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        closeOnNavigation: true,
        data: {
          title: this.translateService.instant('PAGES.ROUTES.DELETE_TITLE', {
            element: route.name,
          }),
          message: this.translateService.instant('PAGES.ROUTES.DELETE_MESSAGE'),
        },
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (!accepted) return;
        this.routesService.deleteRoute(route.id).subscribe((result) => {
          openToast(result.message, 'success');
        });
      });
  }

  openDeleteResponseModal(response: ResponseInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        closeOnNavigation: true,
        data: {
          title: this.translateService.instant('PAGES.ROUTES.DELETE_TITLE', {
            element: response.name,
          }),
          message: this.translateService.instant('PAGES.ROUTES.DELETE_MESSAGE'),
        },
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (!accepted) return;
        this.responsesService
          .deleteResponse(response.id)
          .subscribe((result) => {
            openToast(result.message, 'success');
          });
      });
  }

  #setRouteDataToForm(route: RouteInterface) {
    this.selectedRoute = new FormGroup({
      id: new FormControl(route.id),
      name: new FormControl(route.name),
      method: new FormControl(route.method),
      endpoint: new FormControl(route.endpoint),
      enabled: new FormControl(route.enabled),
      created_at: new FormControl(route.created_at),
      updated_at: new FormControl(route.updated_at),
    });
  }

  #listenToProjectChanges() {
    if (this.projectId === undefined) return;
    this.projectSubscription?.unsubscribe();
    this.projectSubscription = this.realtimeService
      .listenProject(this.projectId)
      .subscribe((action) => {
        if (!this.routes) return;
        if (action === 'updated') {
          this.getRoutes(1, Math.ceil((this.routes.length + 0.01) / 20) * 20);
        } else if (action === 'deleted') {
          this.router.navigate(['/projects']);
        }
      });
  }

  #listenToRouteChanges(routeId: number) {
    if (this.projectId === undefined) return;
    this.routeSubscription?.unsubscribe();
    this.routeSubscription = this.realtimeService
      .listenRoute(routeId)
      .subscribe((action) => {
        if (action === 'updated') {
          this.routesService.getRoute(routeId).subscribe((data) => {
            this.#setRouteDataToForm(data);
            if (!this.responses) return;
            this.getResponses(
              1,
              Math.ceil((this.responses.length + 0.01) / 20) * 20
            );
          });
        } else if (action === 'deleted') {
          this.selectedRoute = undefined;
        }
      });
  }
}
