import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes.service';
import { RouteInterface } from '../../../../interfaces/route.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateRouteInterface } from '../../../../interfaces/create-route.interface';
import { RealtimeService } from '../../../../services/realtime.service';
import { finalize, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsesService } from '../../../../services/responses.service';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../../../interfaces/create-project.interface';
import { ProjectService } from '../../../../services/project.service';
import { CodeInfoComponent } from './components/code-info/code-info.component';
import { DeviceService } from '../../../../services/device.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  projectId?: number;
  isMobile = false;

  routes?: RouteInterface[];
  selectedRoute?: RouteInterface;
  maxRoutes = 0;

  #isFetchingRoutes = false;

  generalSubscriptions = new Subscription();
  projectSubscription?: Subscription;
  routeSubscription?: Subscription;

  constructor(
    private routesService: RoutesService,
    private projectsService: ProjectService,
    private responsesService: ResponsesService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private dialogService: MatDialog,
    private realtimeService: RealtimeService,
    private router: Router,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.#listenToMediaQuery();
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.getRoutes(1);
      this.#listenToProjectChanges();
    });
  }

  ngOnDestroy() {
    this.generalSubscriptions.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
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

  selectRoute(route: RouteInterface) {
    this.selectedRoute = route;
    this.#listenToRouteChanges(route.id);
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

  updateRoute(value: RouteInterface) {
    this.routesService.editRoute(value.id, value).subscribe({
      next: (newRoute) => {
        openToast(
          this.translateService.instant('PAGES.ROUTES.UPDATED_SUCCESSFULLY', {
            route: newRoute.name,
          }),
          'success'
        );
      },
      error: () => {
        const oldRoute = this.routes?.find(
          (route) => route.id === this.selectedRoute?.id
        );
        if (oldRoute) this.selectedRoute = oldRoute;
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
      panelClass: 'mobile-fullscreen',
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

  #listenToMediaQuery() {
    this.generalSubscriptions.add(
      this.deviceService.isMobile.subscribe(
        (isMobile) => (this.isMobile = isMobile)
      )
    );
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
            this.selectedRoute = data;
          });
        } else if (action === 'deleted') {
          this.selectedRoute = undefined;
        }
      });
  }
}
