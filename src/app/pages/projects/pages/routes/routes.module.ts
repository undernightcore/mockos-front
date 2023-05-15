import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';
import { NavbarModule } from '../../../../components/navbar/navbar.module';
import { RouteListItemComponent } from './components/route-list-item/route-list-item.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpChipModule } from '../../../../components/http-chip/http-chip.module';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ChoiceModalModule } from '../../../../components/choice-modal/choice-modal.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { InfiniteScrollModule } from '../../../../directives/infinite-scroll/infinite-scroll.module';
import { ResponseListItemComponent } from './components/response-list-item/response-list-item.component';
import { CreateResponseComponent } from './components/create-response/create-response.component';
import { CompareResponsesComponent } from './components/compare-responses/compare-responses.component';
import { MatTabsModule } from '@angular/material/tabs';
import { CodeInfoComponent } from './components/code-info/code-info.component';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteListItemComponent,
    CreateRouteComponent,
    ResponseListItemComponent,
    CreateResponseComponent,
    CompareResponsesComponent,
    CodeInfoComponent,
  ],
  imports: [
    CommonModule,
    RoutesRoutingModule,
    NavbarModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    HttpChipModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    TranslateModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    ChoiceModalModule,
    DragDropModule,
    InfiniteScrollModule,
    MatTabsModule,
    MatMenuModule,
  ],
})
export class RoutesModule {}
