import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes.service';
import { RouteInterface } from '../../../../interfaces/route.interface';
import { ActivatedRoute } from '@angular/router';
import { openToast } from '../../../../utils/toast.utils';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateRouteInterface } from '../../../../interfaces/create-route.interface';
import { ChoiceModalComponent } from '../../../../components/choice-modal/choice-modal.component';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  routes?: RouteInterface[];
  selectedRoute?: FormGroup;
  projectId?: number;

  constructor(
    private routesService: RoutesService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.#getRoutes();
    });
  }

  selectRoute(route: RouteInterface) {
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

  updateRoute() {
    if (!this.selectedRoute || this.selectedRoute.invalid) return;
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
          this.#getRoutes();
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
      .open(CreateRouteComponent, { width: '500px', data: retryData })
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
            this.#getRoutes();
          },
          error: () => {
            this.openCreateModal(data);
          },
        });
      });
  }

  openDeleteModal(route: RouteInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant('PAGES.ROUTES.DELETE_ROUTE', {
            route: route.name,
          }),
          message: this.translateService.instant(
            'PAGES.ROUTES.DELETE_ROUTE_MESSAGE'
          ),
        },
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (!accepted) return;
        this.routesService.deleteRoute(route.id).subscribe((result) => {
          openToast(result.message, 'success');
          this.#getRoutes();
        });
      });
  }

  #getRoutes() {
    if (this.projectId === undefined) return;
    this.routesService.getRoutes(this.projectId).subscribe((routes) => {
      this.routes = routes.data;
    });
  }
}
