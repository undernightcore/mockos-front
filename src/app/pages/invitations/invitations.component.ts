import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { finalize } from 'rxjs';
import { InvitationInterface } from '../../interfaces/invitation.interface';
import { MatDialog } from '@angular/material/dialog';
import { ChoiceModalComponent } from '../../components/choice-modal/choice-modal.component';

@Component({
  selector: 'app-invitations',
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.scss'],
})
export class InvitationsComponent implements OnInit {
  #isFetching = false;
  invitations?: InvitationInterface[];
  maxInvitations = 0;

  constructor(
    private userService: UserService,
    private dialogService: MatDialog
  ) {}

  ngOnInit() {
    this.#getInvitationsList(1);
  }

  handleScroll(event: Event) {
    if (!this.invitations) return;
    const { scrollTop, scrollHeight, offsetHeight } =
      event.target as HTMLElement;
    if (
      scrollHeight - (scrollTop + offsetHeight) > 200 ||
      this.invitations.length >= this.maxInvitations
    )
      return;
    const pageToRequest = this.invitations.length / 20 + 1;
    this.#getInvitationsList(pageToRequest);
  }

  openAcceptModal(invitation: InvitationInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: 'Do you want to join project?',
          message:
            'This action CAN BE reverted by simply leaving the project later',
        },
      })
      .afterClosed()
      .subscribe((accept) => {
        if (!accept) return;
      });
  }

  #getInvitationsList(page: number) {
    if (this.#isFetching) return;
    this.#isFetching = true;
    this.userService
      .getInvitations(page, 20)
      .pipe(finalize(() => (this.#isFetching = false)))
      .subscribe((invitations) => {
        this.invitations =
          page === 1
            ? invitations.data
            : [...(this.invitations ?? []), ...invitations.data];
        this.maxInvitations = invitations.meta.total;
      });
  }
}
