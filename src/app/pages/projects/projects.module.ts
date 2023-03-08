import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsRoutingModule } from './projects-routing.module';
import { ProjectsComponent } from './projects.component';
import { NavbarModule } from '../../components/navbar/navbar.module';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { ChoiceModalModule } from '../../components/choice-modal/choice-modal.module';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectCardComponent,
    ProjectModalComponent,
  ],
  imports: [
    CommonModule,
    ProjectsRoutingModule,
    NavbarModule,
    ScrollingModule,
    TranslateModule,
    MatIconModule,
    ChoiceModalModule,
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
})
export class ProjectsModule {}
