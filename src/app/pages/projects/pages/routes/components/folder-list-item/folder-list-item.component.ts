import { Component, Input } from '@angular/core';
import { FolderInterface } from '../../../../../../interfaces/route.interface';

@Component({
  selector: 'app-folder-list-item',
  templateUrl: './folder-list-item.component.html',
  styleUrls: ['./folder-list-item.component.scss'],
})
export class FolderListItemComponent {
  @Input() sortable = true;
  @Input() folder!: FolderInterface;

  log(an: any) {
    console.log(an);
  }
}