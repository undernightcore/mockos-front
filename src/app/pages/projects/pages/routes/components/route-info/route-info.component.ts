import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  HttpMethods,
  RouteInterface,
} from '../../../../../../interfaces/route.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, Subscription } from 'rxjs';
import { RealtimeService } from '../../../../../../services/realtime/realtime.service';
import { RoutesService } from '../../../../../../services/routes/routes.service';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';
import { CreateResponseComponent } from '../create-response/create-response.component';
import { ChoiceModalComponent } from '../../../../../../components/choice-modal/choice-modal.component';
import { openToast } from '../../../../../../utils/toast.utils';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ResponsesService } from '../../../../../../services/responses/responses.service';
import { ResponseModel } from '../../../../../../models/response.model';
import { DeviceService } from '../../../../../../services/device/device.service';
import { EditHeadersResponseComponent } from '../edit-headers-response/edit-headers-response.component';
import { calculateAmountToFetch } from '../../../../../../utils/page.utils';

@Component({
  selector: 'app-route-info',
  templateUrl: './route-info.component.html',
  styleUrls: ['./route-info.component.scss'],
})
export class RouteInfoComponent implements OnInit, OnDestroy {
  @Input() set route(value: RouteInterface | undefined) {
    this.#reactToRouteChange(value);
  }

  @Output() updatedRoute = new EventEmitter<RouteInterface>();
  @Output() back = new EventEmitter<void>();

  routeForm?: FormGroup;
  responses?: ResponseModel[];
  maxResponses = 0;

  #isFetchingResponses = false;
  isEditingTitle = false;

  isMobile = false;

  subscriptions = new Subscription();

  constructor(
    private realtimeService: RealtimeService,
    private routesService: RoutesService,
    private dialogService: MatDialog,
    private translateService: TranslateService,
    private responsesService: ResponsesService,
    private deviceService: DeviceService
  ) {}

  ngOnInit() {
    this.#listenOnMediaQuery();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getResponses(page: number, perPage = 20) {
    if (this.routeForm === undefined || this.#isFetchingResponses) return;
    this.#isFetchingResponses = true;
    this.responsesService
      .getResponses(this.routeForm.value.id, page, perPage)
      .pipe(finalize(() => (this.#isFetchingResponses = false)))
      .subscribe((responses) => {
        this.responses =
          page === 1
            ? responses.data
            : [...(this.responses ?? []), ...responses.data];
        this.maxResponses = responses.meta.total;
      });
  }

  selectMethod(method: HttpMethods) {
    this.routeForm?.controls['method'].setValue(method);
    this.updateRoute();
  }

  selectResponse(response: ResponseModel) {
    this.responsesService
      .editResponse(
        response.id,
        { ...response, enabled: true },
        response.is_file
      )
      .subscribe((result) => {
        openToast(result.message, 'success');
      });
  }

  updateRoute() {
    if (!this.routeForm || this.routeForm.invalid) return;
    this.updatedRoute.emit(this.routeForm.value);
  }

  openCreateResponseModal(responseData?: ResponseModel) {
    if (!this.routeForm) return;
    this.dialogService.open(CreateResponseComponent, {
      closeOnNavigation: true,
      height: '90%',
      width: '70%',
      data: { routeId: this.routeForm.value.id, responseData },
      panelClass: 'mobile-fullscreen',
      autoFocus: false,
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
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((accepted) => {
        if (!accepted) return;
        this.routesService.deleteRoute(route.id).subscribe((result) => {
          openToast(result.message, 'success');
        });
      });
  }

  openDeleteResponseModal(response: ResponseModel) {
    this.dialogService
      .open(ChoiceModalComponent, {
        closeOnNavigation: true,
        data: {
          title: this.translateService.instant('PAGES.ROUTES.DELETE_TITLE', {
            element: response.name,
          }),
          message: this.translateService.instant('PAGES.ROUTES.DELETE_MESSAGE'),
        },
        autoFocus: false,
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

  openHeadersModal(response: ResponseModel) {
    this.dialogService.open(EditHeadersResponseComponent, {
      panelClass: 'mobile-fullscreen',
      height: '60%',
      width: '60%',
      data: response,
      autoFocus: false,
    });
  }

  #listenOnMediaQuery() {
    this.subscriptions.add(
      this.deviceService.isMobile.subscribe(
        (isMobile) => (this.isMobile = isMobile)
      )
    );
  }

  #reactToRouteChange(value?: RouteInterface) {
    const hasSelectedSameRoute =
      value?.id === this.routeForm?.value.id && this.responses?.length;
    this.#setDataToForm(value);
    this.getResponses(
      1,
      hasSelectedSameRoute
        ? calculateAmountToFetch(this.responses?.length ?? 0, 20)
        : undefined
    );
    this.isEditingTitle = false;
  }

  #setDataToForm(value?: RouteInterface) {
    this.routeForm = value
      ? new FormGroup({
          id: new FormControl(value.id),
          name: new FormControl(value.name),
          method: new FormControl(value.method),
          endpoint: new FormControl(value.endpoint),
          enabled: new FormControl(value.enabled),
          created_at: new FormControl(value.created_at),
          updated_at: new FormControl(value.updated_at),
        })
      : undefined;
  }

  trackByResponse(index: number, response: ResponseModel) {
    return `${index}-${response.id}`;
  }
}
