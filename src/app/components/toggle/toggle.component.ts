import { Component, Input, OnInit } from '@angular/core';
import { ButtonSizeInterface } from '../button/interfaces/button.interfaces';

@Component({
  selector: 'app-toggle',
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss'],
})
export class ToggleComponent {
  @Input() size: ButtonSizeInterface = 'medium';
  @Input() compressed = false;
  @Input() disabled = false;
  @Input() checked = false;
}
