import { Component, Input } from '@angular/core';
import { HttpMethods } from '../../interfaces/route.interface';

@Component({
  selector: 'app-http-chip',
  templateUrl: './http-chip.component.html',
  styleUrls: ['./http-chip.component.scss'],
})
export class HttpChipComponent {
  @Input() method: HttpMethods = 'get';
}
