import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ForkedProjectInterface } from '../../../../interfaces/project.interface';
import { fromEvent, take } from 'rxjs';
import { CdkMenuTrigger } from '@angular/cdk/menu';
import { FormControl } from '@angular/forms';
import { LayoutService } from '../../../../services/layout/layout.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
})
export class ProjectCardComponent implements OnInit {
  @Input() project?: ForkedProjectInterface;
  @Input() set isSelected(value: boolean) {
    this.selectedForm.setValue(value, { emitEvent: false });
  }

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() selected = new EventEmitter<boolean>();

  selectedForm = new FormControl(false, { nonNullable: true });

  showProjectsAsList$ = this.layoutService.showProjectsAsList$;

  constructor(private layoutService: LayoutService) {}

  ngOnInit() {
    this.selectedForm.valueChanges.subscribe((value) =>
      this.selected.emit(value)
    );
  }

  @ViewChild(CdkMenuTrigger) trigger?: CdkMenuTrigger;
  listenOnScroll() {
    fromEvent(window, 'scroll', { once: true, capture: true })
      .pipe(take(1))
      .subscribe(() => {
        this.trigger?.close();
      });
  }

  openEditModal() {
    this.trigger?.close();
    this.edit.emit();
  }

  openDeleteModal() {
    this.trigger?.close();
    this.delete.emit();
  }
}
