import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ForkedProjectInterface } from '../../../../interfaces/project.interface';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent {
  @Input() project?: ForkedProjectInterface;
  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
}
