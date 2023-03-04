import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationResultRoutingModule } from './verification-result-routing.module';
import { VerificationResultComponent } from './verification-result.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [VerificationResultComponent],
  imports: [
    CommonModule,
    VerificationResultRoutingModule,
    NavbarModule,
    MatButtonModule,
    TranslateModule,
  ],
})
export class VerificationResultModule {}
