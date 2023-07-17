import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  ResponseInterface,
  SimpleResponseInterface,
} from '../../../../../../interfaces/response.interface';
import { ResponseModel } from '../../../../../../models/response.model';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent {
  @Input() response?: SimpleResponseInterface;
  @Output() delete = new EventEmitter<void>();
  @Output() select = new EventEmitter<void>();
  @Output() config = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
}
