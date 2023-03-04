import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationResultRoutingModule } from './verification-result-routing.module';
import { VerificationResultComponent } from './verification-result.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [VerificationResultComponent],
  imports: [
    CommonModule,
    VerificationResultRoutingModule,
    NavbarModule,
    MatButtonModule,
  ],
})
export class VerificationResultModule {}
