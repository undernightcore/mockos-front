import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { NotFoundComponent } from './not-found.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NotFoundComponent],
  imports: [CommonModule, NotFoundRoutingModule, NavbarModule, TranslateModule],
})
export class NotFoundModule {}
