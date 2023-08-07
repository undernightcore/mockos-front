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
import { TokensComponent } from './components/tokens/tokens.component';
import { MatMenuModule } from '@angular/material/menu';
import { RouteInfoComponent } from './components/route-info/route-info.component';
import { EditHeadersResponseComponent } from './components/edit-headers-response/edit-headers-response.component';
import { MatTooltipModule } from "@angular/material/tooltip";
import { DuplicateResponseComponent } from './components/duplicate-response/duplicate-response.component';
import { ClipboardModule } from "@angular/cdk/clipboard";
import { DeleteTokenComponent } from './components/delete-token/delete-token.component';
import { CreateTokenComponent } from './components/create-token/create-token.component';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteListItemComponent,
    CreateRouteComponent,
    ResponseListItemComponent,
    CreateResponseComponent,
    CompareResponsesComponent,
    TokensComponent,
    RouteInfoComponent,
    EditHeadersResponseComponent,
    DuplicateResponseComponent,
    DeleteTokenComponent,
    CreateTokenComponent,
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
    MatTooltipModule,
    ClipboardModule
  ]
})
export class RoutesModule {}
