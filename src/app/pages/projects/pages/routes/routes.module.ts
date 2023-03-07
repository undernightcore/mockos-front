import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesRoutingModule } from './routes-routing.module';
import { RoutesComponent } from './routes.component';
import { NavbarModule } from '../../../../components/navbar/navbar.module';
import { RouteListItemComponent } from './components/route-list-item/route-list-item.component';
import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [RoutesComponent, RouteListItemComponent],
  imports: [CommonModule, RoutesRoutingModule, NavbarModule, MatChipsModule],
})
export class RoutesModule {}
