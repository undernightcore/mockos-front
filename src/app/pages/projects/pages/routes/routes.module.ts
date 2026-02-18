import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { CdkMenuModule } from '@angular/cdk/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NgLetModule } from 'ng-let';
import { DragulaModule } from 'ng2-dragula';
import { MonacoEditorModule } from 'src/app/components/monaco/editor.module';
import { AutoAnimateModule } from 'src/app/directives/auto-animate/auto-animate.module';
import { ButtonModule } from '../../../../components/button/button.module';
import { CheckboxModule } from '../../../../components/checkbox/checkbox.module';
import { ChoiceModalModule } from '../../../../components/choice-modal/choice-modal.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { HeadersModalModule } from '../../../../components/headers-modal/headers-modal.module';
import { HttpChipModule } from '../../../../components/http-chip/http-chip.module';
import { InputModule } from '../../../../components/input/input.module';
import { NavbarModule } from '../../../../components/navbar/navbar.module';
import { InfiniteScrollModule } from '../../../../directives/infinite-scroll/infinite-scroll.module';
import { CompareResponsesComponent } from './components/compare-responses/compare-responses.component';
import { CreateResponseComponent } from './components/create-response/create-response.component';
import { CreateRouteComponent } from './components/create-route/create-route.component';
import { CreateTokenComponent } from './components/create-token/create-token.component';
import { DeleteTokenComponent } from './components/delete-token/delete-token.component';
import { DuplicateResponseComponent } from './components/duplicate-response/duplicate-response.component';
import { FolderListItemComponent } from './components/folder-list-item/folder-list-item.component';
import { ForkProjectComponent } from './components/fork-project/fork-project.component';
import { ImportSwaggerComponent } from './components/import-swagger/import-swagger.component';
import { LiveMockComponent } from './components/live-mock/live-mock.component';
import { MethodSelectorComponent } from './components/method-selector/method-selector.component';
import { ResponseListItemComponent } from './components/response-list-item/response-list-item.component';
import { RouteActionsComponent } from './components/route-actions/route-actions.component';
import { RouteInfoComponent } from './components/route-info/route-info.component';
import { RouteListItemComponent } from './components/route-list-item/route-list-item.component';
import { RouteListComponent } from './components/route-list/route-list.component';
import { TokensComponent } from './components/tokens/tokens.component';
import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';
import { BuildPromptComponent } from './components/build-prompt/build-prompt.component';

@NgModule({
  declarations: [
    RoutesComponent,
    RouteListItemComponent,
    CreateRouteComponent,
    ResponseListItemComponent,
    CreateResponseComponent,
    ImportSwaggerComponent,
    CompareResponsesComponent,
    TokensComponent,
    RouteInfoComponent,
    DuplicateResponseComponent,
    DeleteTokenComponent,
    CreateTokenComponent,
    FolderListItemComponent,
    RouteListComponent,
    RouteActionsComponent,
    MethodSelectorComponent,
    LiveMockComponent,
    ForkProjectComponent,
    BuildPromptComponent,
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
    MatSelectModule,
    ChoiceModalModule,
    InfiniteScrollModule,
    MatTabsModule,
    MatMenuModule,
    MatTooltipModule,
    ClipboardModule,
    MatProgressSpinnerModule,
    ButtonModule,
    InputModule,
    CheckboxModule,
    AutoAnimateModule,
    NgLetModule,
    CdkMenuModule,
    DialogModule,
    DragulaModule,
    MonacoEditorModule,
    MatMenuModule,
    MatBadgeModule,
    HeadersModalModule,
  ],
})
export class RoutesModule {}
