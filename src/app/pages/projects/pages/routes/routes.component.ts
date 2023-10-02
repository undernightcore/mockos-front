import { Component, OnDestroy, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes/routes.service';
import {
  FolderInterface,
  RouteInterface,
} from '../../../../interfaces/route.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateRouteInterface } from '../../../../interfaces/create-route.interface';
import { RealtimeService } from '../../../../services/realtime/realtime.service';
import {
  debounceTime,
  filter,
  finalize,
  from,
  iif,
  of,
  Subscription,
  switchMap,
  tap,
} from 'rxjs';
import { moveItemInArray } from '@angular/cdk/drag-drop';
import { ProjectModalComponent } from '../../components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../../../interfaces/create-project.interface';
import { ProjectService } from '../../../../services/project/project.service';
import { TokensComponent } from './components/tokens/tokens.component';
import { DeviceService } from '../../../../services/device/device.service';
import { FormControl } from '@angular/forms';
import { calculateAmountToFetch } from '../../../../utils/page.utils';
import { CreateFolderInterface } from '../../../../interfaces/create-folder.interface';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit, OnDestroy {
  projectId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
  isMobile = false;

  routes?: (RouteInterface | FolderInterface)[];
  maxRoutes = 0;
  search = new FormControl('');
  selectedRoute?: RouteInterface;
  selectedFolder?: FolderInterface;

  draggingIndex?: number;
  hoveringIndex?: { index: number | null; move: boolean };

  #isFetchingRoutes = false;

  generalSubscriptions = new Subscription();
  projectSubscription?: Subscription;
  routeSubscription?: Subscription;

  constructor(
    private routesService: RoutesService,
    private projectsService: ProjectService,
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
    this.getRoutes(1).subscribe();
  }

  ngOnDestroy() {
    this.generalSubscriptions.unsubscribe();
    this.projectSubscription?.unsubscribe();
    this.routeSubscription?.unsubscribe();
  }

  getRoutes(page: number, perPage = 20, folderId?: number) {
    return iif(
      () => !this.#isFetchingRoutes,
      this.routesService
        .getRoutes(
          this.projectId,
          folderId,
          this.search.value || undefined,
          page,
          perPage
        )
        .pipe(
          finalize(() => (this.#isFetchingRoutes = false)),
          tap({
            subscribe: () => (this.#isFetchingRoutes = true),
            next: (routes) => {
              this.routes =
                page === 1
                  ? routes.data
                  : [...(this.routes ?? []), ...routes.data];
              this.maxRoutes = routes.meta.total;
            },
            finalize: () => (this.#isFetchingRoutes = false),
          })
        ),
      of(undefined)
    );
  }

  selectRoute(route: RouteInterface) {
    this.selectedRoute = route;
    this.#listenToRouteChanges(route.id);
  }

  selectFolder(folder?: FolderInterface) {
    this.routeSubscription?.unsubscribe();
    this.selectedRoute = undefined;
    this.getRoutes(1, undefined, folder?.id).subscribe(() => {
      this.selectedFolder = folder;
    });
  }

  deleteFolder(folder: FolderInterface) {
    this.selectFolder();
    this.routesService.deleteRoute(folder.id).subscribe(({ message }) => {
      openToast(message, 'success');
    });
  }

  handleDraggingSort(droppingIndex: number, position?: 'up' | 'down') {
    if (this.routes === undefined || this.draggingIndex === undefined) return;

    const previousIndex =
      droppingIndex < this.draggingIndex ? droppingIndex : droppingIndex - 1;
    const posteriorIndex =
      droppingIndex < this.draggingIndex ? droppingIndex + 1 : droppingIndex;

    this.hoveringIndex =
      position && this.routes
        ? position === 'up'
          ? { index: previousIndex, move: false }
          : { index: posteriorIndex, move: false }
        : undefined;
  }

  handleSort() {
    if (
      this.hoveringIndex === undefined ||
      this.draggingIndex === undefined ||
      !this.routes
    ) {
      this.draggingIndex = undefined;
      return;
    }

    if (this.hoveringIndex.move) {
      this.#handleMove(this.draggingIndex, this.hoveringIndex.index);
    } else {
      this.#handleSort(this.draggingIndex, this.hoveringIndex.index);
    }

    this.draggingIndex = undefined;
  }

  updateRoute(value: RouteInterface) {
    if (value.is_folder) return;
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
        if (oldRoute && !oldRoute.is_folder) this.selectedRoute = oldRoute;
      },
    });
  }

  openCreateModal(
    isFolder: boolean,
    retryData?: CreateRouteInterface | CreateFolderInterface
  ) {
    this.dialogService
      .open(CreateRouteComponent, {
        closeOnNavigation: true,
        width: '500px',
        data: { isFolder, data: retryData },
        autoFocus: false,
      })
      .afterClosed()
      .pipe(filter((data) => data))
      .subscribe(
        (data?: {
          isFolder: boolean;
          data: CreateRouteInterface | CreateFolderInterface;
        }) => {
          if (data!.isFolder) {
            this.#createFolder(data!.data as CreateFolderInterface);
          } else {
            this.#createRoute(data!.data as CreateRouteInterface);
          }
        }
      );
  }

  openTokensModal(projectId?: number) {
    if (!projectId) return;
    this.dialogService.open(TokensComponent, {
      data: projectId,
      height: '60%',
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
      .pipe(
        filter((newProject) => Boolean(newProject)),
        switchMap((newProject) =>
          this.projectsService.forkProject(this.projectId!, newProject)
        )
      )
      .subscribe({
        next: (data) => {
          openToast(data.message, 'success');
          this.router.navigate(['/projects']);
        },
        error: () => {
          this.openForkModal(project);
        },
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
    this.search.valueChanges.pipe(debounceTime(500)).subscribe(() => {
      this.getRoutes(1, 20, this.selectedFolder?.id).subscribe();
    });
  }

  #listenToProjectChanges() {
    if (this.projectId === undefined) return;
    this.projectSubscription?.unsubscribe();
    this.projectSubscription = this.realtimeService
      .listenProject(this.projectId)
      .pipe(
        switchMap((event) =>
          event === 'updated'
            ? this.getRoutes(
                1,
                calculateAmountToFetch(this.routes?.length ?? 0, 20),
                this.selectedFolder?.id
              )
            : from(this.router.navigate(['/projects']))
        )
      )
      .subscribe();
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

  #handleSort(draggingIndex: number, hoveringIndex: number | null) {
    if (this.projectId === undefined || !this.routes || hoveringIndex === null)
      return;
    const previousState = [...this.routes];
    const draggingItem = this.routes[draggingIndex];
    const hoveringItem = this.routes[hoveringIndex];

    moveItemInArray(this.routes, draggingIndex, hoveringIndex);

    this.routesService
      .sortRoute(this.projectId, draggingItem.id, hoveringItem.id)
      .subscribe({
        next: (result) => {
          openToast(result.message, 'success');
        },
        error: () => {
          this.routes = previousState;
        },
      });
  }

  #handleMove(draggingIndex: number, hoveringIndex: number | null) {
    if (!this.routes) return;
    this.routesService
      .moveRoute(
        this.projectId,
        this.routes[draggingIndex].id,
        hoveringIndex !== null ? this.routes[hoveringIndex].id : null
      )
      .subscribe(({ message }) => {
        openToast(message, 'success');
      });
  }

  #createRoute(data: CreateRouteInterface) {
    this.routesService
      .createRoute(this.projectId, {
        ...data,
        parentFolderId: this.selectedFolder?.id ?? null,
      })
      .subscribe({
        next: (newRoute) => {
          openToast(
            this.translateService.instant('PAGES.ROUTES.CREATED_SUCCESSFULLY', {
              route: newRoute.name,
            }),
            'success'
          );
        },
        error: () => {
          this.openCreateModal(false, data);
        },
      });
  }

  #createFolder(data: CreateFolderInterface) {
    this.routesService.createFolder(this.projectId, data).subscribe({
      next: (newRoute) => {
        openToast(
          this.translateService.instant('PAGES.ROUTES.CREATED_SUCCESSFULLY', {
            route: newRoute.name,
          }),
          'success'
        );
      },
      error: () => {
        this.openCreateModal(true, data);
      },
    });
  }

  trackByRoute(index: number, route: RouteInterface | FolderInterface) {
    return `${index}-${route.id}`;
  }
}
