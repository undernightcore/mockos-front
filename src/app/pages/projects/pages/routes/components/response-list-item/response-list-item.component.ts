import { Component, Input, OnInit } from '@angular/core';
import { ResponseInterface } from '../../../../../../interfaces/response.interface';

@Component({
  selector: 'app-response-list-item',
  templateUrl: './response-list-item.component.html',
  styleUrls: ['./response-list-item.component.scss'],
})
export class ResponseListItemComponent implements OnInit {
  @Input() response?: ResponseInterface;

  constructor() {}

  ngOnInit(): void {}
}
