import { Component, Input } from '@angular/core';
import { ProjectInterface } from '../../../../interfaces/project.interface';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project?: ProjectInterface;
}
