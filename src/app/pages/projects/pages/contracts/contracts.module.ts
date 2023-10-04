import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import { IsValidVersion } from './pipes/is-valid-version/is-valid-version.pipe';
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [ContractsComponent, IsValidVersion],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    MonacoEditorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    MatTooltipModule,
    TranslateModule,
  ],
})
export class ContractsModule {}
