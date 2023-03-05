import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ChoiceModalModule } from '../../components/choice-modal/choice-modal.module';

@NgModule({
  declarations: [DashboardComponent, ProjectCardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavbarModule,
    ScrollingModule,
    TranslateModule,
    MatIconModule,
    ChoiceModalModule,
  ],
})
export class DashboardModule {}
