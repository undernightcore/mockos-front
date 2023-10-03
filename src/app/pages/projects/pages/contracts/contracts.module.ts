import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ContractsComponent],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    MonacoEditorModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class ContractsModule {}
