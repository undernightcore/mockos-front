import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvitationInterface } from '../../../../interfaces/invitation.interface';

@Component({
  selector: 'app-invitation-card',
  templateUrl: './invitation-card.component.html',
  styleUrls: ['./invitation-card.component.scss'],
})
export class InvitationCardComponent {
  @Input() invitation?: InvitationInterface;
  @Output() selected = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();
}
