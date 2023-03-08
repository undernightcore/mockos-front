import { Component, Input } from '@angular/core';
import { RouteInterface } from '../../../../../../interfaces/route.interface';

@Component({
  selector: 'app-route-list-item',
  templateUrl: './route-list-item.component.html',
  styleUrls: ['./route-list-item.component.scss'],
})
export class RouteListItemComponent {
  @Input() route!: RouteInterface;

  constructor() {}
}
