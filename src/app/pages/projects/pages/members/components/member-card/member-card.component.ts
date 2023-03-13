import { Component, Input } from '@angular/core';
import { MemberInterface } from '../../../../../../interfaces/member.interface';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent {
  @Input() member?: MemberInterface;
}
