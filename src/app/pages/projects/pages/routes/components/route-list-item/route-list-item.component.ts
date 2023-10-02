import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouteInterface } from '../../../../../../interfaces/route.interface';

@Component({
  selector: 'app-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
})
export class RouteListItemComponent {
  @Input() route!: RouteInterface;
  @Input() isSelected = false;
  @Input() sortingMode = false;
  @Input() showBackButton = false;

  dragZone?: 'up' | 'down';

  @Output() draggingStart = new EventEmitter();
  @Output() draggingEnd = new EventEmitter();

  @Output() dragging = new EventEmitter<'up' | 'down' | undefined>();

  draggingInEdge(position?: 'up' | 'down') {
    this.dragZone = position;
    if (!this.sortingMode) return;
    this.dragging.emit(position)
  }
}
