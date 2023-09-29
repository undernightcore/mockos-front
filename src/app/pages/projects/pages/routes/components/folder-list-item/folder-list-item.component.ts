import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FolderInterface } from '../../../../../../interfaces/route.interface';

@Component({
  selector: 'app-folder-list-item',
  templateUrl: './folder-list-item.component.html',
  styleUrls: ['./folder-list-item.component.scss'],
})
export class FolderListItemComponent {
  @Input() folder!: FolderInterface;
  @Input() sortingMode = false;

  @Output() draggingStart = new EventEmitter();
  @Output() draggingEnd = new EventEmitter();
  @Output() dragging = new EventEmitter<'up' | 'down' | undefined>();
  @Output() dropping = new EventEmitter<boolean>();

  dragZone?: 'up' | 'down';

  draggingInEdge(position?: 'up' | 'down') {
    this.dragZone = position;
    if (!this.sortingMode) return;
    this.dragging.emit(position);
  }

  draggingInside(enter: boolean) {
    if (!this.sortingMode) return;
    this.dropping.emit(enter);
  }
}
