import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SimpleResponseInterface } from '../../../../../../interfaces/response.interface';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent {
  @Input() response?: SimpleResponseInterface;
  @Input() loading = false;

  @Output() delete = new EventEmitter<void>();
  @Output() select = new EventEmitter<void>();
  @Output() config = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() duplicate = new EventEmitter<void>();

  openConfigModal(click: MouseEvent) {
    click.stopPropagation();
    this.config.emit();
  }

  openDeleteModal(click: MouseEvent) {
    click.stopPropagation();
    this.delete.emit();
  }

  openDuplicateModal(click: MouseEvent) {
    click.stopPropagation();
    this.duplicate.emit();
  }

  openSelectModal(click: MouseEvent) {
    click.stopPropagation();
    this.select.emit();
  }
}
