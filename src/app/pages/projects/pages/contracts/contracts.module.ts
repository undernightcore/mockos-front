import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { IsValidVersion } from './pipes/is-valid-version/is-valid-version.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CompareContractsComponent } from './components/compare-contracts/compare-contracts.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MonacoEditorModule } from '../../../../components/monaco/editor.module';
import { ContractsVersionsComponent } from './components/contracts-versions/contracts-versions.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { InfiniteScrollModule } from '../../../../directives/infinite-scroll/infinite-scroll.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [
    ContractsComponent,
    IsValidVersion,
    CompareContractsComponent,
    ContractsVersionsComponent,
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule,
    TranslateModule,
    MatDialogModule,
    MonacoEditorModule,
    MatProgressSpinnerModule,
    InfiniteScrollModule,
    MatListModule,
  ],
})
export class ContractsModule {}
