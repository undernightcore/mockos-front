import { Component, Input } from '@angular/core';
import { UserInterface } from '../../../../../../interfaces/user.interface';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent {
  @Input() profile?: UserInterface;
}
