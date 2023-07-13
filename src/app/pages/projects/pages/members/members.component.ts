import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { ProjectInterface } from '../../../../interfaces/project.interface';
import { MatDialog } from '@angular/material/dialog';
import { InviteModalComponent } from './components/invite-modal/invite-modal.component';
import { openToast } from '../../../../utils/toast.utils';
import { MemberInterface } from '../../../../interfaces/member.interface';
import { ChoiceModalComponent } from '../../../../components/choice-modal/choice-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  projectId?: number;
  project?: ProjectInterface;
  members?: MemberInterface[];
  maxMembers = 0;
  #isFetching = false;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private dialogService: MatDialog,
    private router: Router,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'] ? Number(params['id']) : undefined;
      this.#getProject();
    });
  }

  openInviteModal(email?: string) {
    this.dialogService
      .open(InviteModalComponent, {
        width: '500px',
        data: email,
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((newEmail?: string) => {
        if (!newEmail || this.projectId === undefined) return;
        this.projectService
          .inviteToProject(this.projectId, newEmail)
          .subscribe({
            next: (message) => {
              openToast(message.message, 'success');
              this.#getProject();
            },
            error: () => {
              this.openInviteModal(newEmail);
            },
          });
      });
  }

  openLeaveModal() {
    if (!this.projectId) return;
    const title = this.translateService.instant(
      'PAGES.MEMBERS.LEAVE_PROJECT_TITLE'
    );
    const message = this.translateService.instant(
      'PAGES.MEMBERS.LEAVE_PROJECT_MESSAGE'
    );
    this.dialogService
      .open(ChoiceModalComponent, {
        data: { title, message },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((leave) => {
        if (!leave) return;
        this.projectService
          .leaveProject(this.projectId!)
          .subscribe((message) => {
            openToast(message.message, 'success');
            this.router.navigate(['/projects']);
          });
      });
  }

  #getProject() {
    if (this.projectId === undefined) return;
    this.projectService.getProject(this.projectId).subscribe((project) => {
      this.project = project;
      this.getMemberList(1);
    });
  }

  getMemberList(page: number) {
    if (this.#isFetching || this.projectId === undefined) return;
    this.#isFetching = true;
    this.projectService
      .getMemberList(this.projectId, page, 20)
      .pipe(finalize(() => (this.#isFetching = false)))
      .subscribe((members) => {
        this.members =
          page === 1
            ? members.data
            : [...(this.members ?? []), ...members.data];
        this.maxMembers = members.meta.total;
      });
  }
}
