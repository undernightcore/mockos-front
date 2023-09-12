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
  @Input() showBackButton = false;

  @Output() back = new EventEmitter();

  goBack(event: MouseEvent) {
    event.stopPropagation();
    this.back.emit();
  }
}
