import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MembersRoutingModule } from './members-routing.module';
import { MembersComponent } from './members.component';
import { NavbarModule } from '../../../../components/navbar/navbar.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [MembersComponent],
  imports: [CommonModule, MembersRoutingModule, NavbarModule, TranslateModule],
})
export class MembersModule {}
