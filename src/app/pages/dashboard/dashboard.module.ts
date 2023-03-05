import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';

@NgModule({
  declarations: [DashboardComponent, ProjectCardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavbarModule,
    ScrollingModule,
  ],
})
export class DashboardModule {}
