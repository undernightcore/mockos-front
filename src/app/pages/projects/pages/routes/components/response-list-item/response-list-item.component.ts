import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent {
  @Input() response?: ResponseInterface;
  @Output() delete = new EventEmitter<void>();
  @Output() select = new EventEmitter<void>();
  @Output() config = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}
