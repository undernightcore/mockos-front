import { Component, OnInit } from '@angular/core';
import { InvitationsService } from '../../services/invitations/invitations.service';
import { finalize } from 'rxjs';
import { InvitationInterface } from '../../interfaces/invitation.interface';
import { MatDialog } from '@angular/material/dialog';
import { ChoiceModalComponent } from '../../components/choice-modal/choice-modal.component';
import { openToast } from '../../utils/toast.utils';
import { TranslateService } from '@ngx-translate/core';

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
    private invitationsService: InvitationsService,
    private dialogService: MatDialog,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getInvitationsList(1);
  }

  openAcceptModal(invitation: InvitationInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            'PAGES.INVITATIONS.ACCEPT_TITLE',
            { project: invitation.project.name }
          ),
          message: this.translateService.instant(
            'PAGES.INVITATIONS.ACCEPT_MESSAGE'
          ),
        },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((accept) => {
        if (!accept) return;
        this.invitationsService
          .acceptInvitation(invitation.id)
          .subscribe((message) => {
            openToast(message.message, 'success');
            this.getInvitationsList(1);
          });
      });
  }

  openRejectModal(invitation: InvitationInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            'PAGES.INVITATIONS.REJECT_TITLE',
            { project: invitation.project.name }
          ),
          message: this.translateService.instant(
            'PAGES.INVITATIONS.REJECT_MESSAGE'
          ),
        },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((reject) => {
        if (!reject) return;
        this.invitationsService
          .rejectInvitation(invitation.id)
          .subscribe((message) => {
            openToast(message.message, 'success');
            this.getInvitationsList(1);
          });
      });
  }

  getInvitationsList(page: number) {
    if (this.#isFetching) return;
    this.#isFetching = true;
    this.invitationsService
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
