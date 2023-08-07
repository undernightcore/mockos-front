import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes/routes.service';
import { RouteInterface } from '../../../../interfaces/route.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateRouteInterface } from '../../../../interfaces/create-route.interface';
import { RealtimeService } from '../../../../services/realtime/realtime.service';
import { debounceTime, finalize, Subscription } from 'rxjs';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsesService } from '../../../../services/responses/responses.service';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../../../interfaces/create-project.interface';
import { ProjectService } from '../../../../services/project/project.service';
import { TokensComponent } from './components/tokens/tokens.component';
import { DeviceService } from '../../../../services/device/device.service';
import { FormControl } from '@angular/forms';
import { calculateAmountToFetch } from '../../../../utils/page.utils';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  projectId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  isMobile = false;

  routes?: RouteInterface[];
  maxRoutes = 0;
  search = new FormControl('');
  selectedRoute?: RouteInterface;

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
    this.#listenToSearch();
    this.#listenToProjectChanges();
    this.getRoutes(1);
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
      .getRoutes(this.projectId, this.search.value || undefined, page, perPage)
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
        autoFocus: false,
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

  openTokensModal(projectId?: number) {
    if (!projectId) return;
    this.dialogService.open(TokensComponent, {
      data: projectId,
      height: '70%',
      width: '50%',
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
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
        autoFocus: false,
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

  #listenToSearch() {
    this.search.valueChanges.pipe(debounceTime(500)).subscribe((search) => {
      this.getRoutes(1, 20);
    });
  }

  #listenToProjectChanges() {
    if (this.projectId === undefined) return;
    this.projectSubscription?.unsubscribe();
    this.projectSubscription = this.realtimeService
      .listenProject(this.projectId)
      .subscribe((action) => {
        if (action === 'updated') {
          this.getRoutes(
            1,
            calculateAmountToFetch(this.routes?.length ?? 0, 20)
          );
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

  trackByRoute(index: number, route: RouteInterface) {
    return `${index}-${route.id}`;
  }
}
