import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project/project.service';
import { ForkedProjectInterface } from '../../interfaces/project.interface';
import { finalize, iif } from 'rxjs';
import { ChoiceModalComponent } from '../../components/choice-modal/choice-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { openToast } from '../../utils/toast.utils';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { CreateProjectInterface } from '../../interfaces/create-project.interface';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  projects?: ForkedProjectInterface[];
  maxProjects = 0;
  invitationNumber?: number;
  #isFetching = false;

  constructor(
    private projectService: ProjectService,
    private dialogService: MatDialog,
    private translateService: TranslateService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.getProjects(1);
    this.#getInvitationAmount();
  }

  openDeleteModal(project: ForkedProjectInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            'PAGES.DASHBOARD.DELETE_PROJECT',
            { project: project.name }
          ),
          message: this.translateService.instant(
            'PAGES.DASHBOARD.DELETE_PROJECT_MESSAGE',
            { project: project.name }
          ),
        },
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (!confirmed) return;
        this.projectService.deleteProject(project.id).subscribe((message) => {
          openToast(message.message, 'success');
          this.getProjects(1);
        });
      });
  }

  openCreateModal(project?: ForkedProjectInterface) {
    this.dialogService
      .open(ProjectModalComponent, { data: { project }, autoFocus: false })
      .afterClosed()
      .subscribe((data: CreateProjectInterface | undefined) => {
        if (!data) return;
        iif(
          () => !project,
          this.projectService.createProject(data),
          this.projectService.editProject(project?.id as number, data)
        ).subscribe((response) => {
          openToast(
            this.translateService.instant(
              !project
                ? 'PAGES.DASHBOARD.PROJECT_CREATED'
                : 'PAGES.DASHBOARD.PROJECT_EDITED',
              {
                project: response.name,
              }
            ),
            'success'
          );
          this.getProjects(1);
        });
      });
  }

  getProjects(page: number) {
    if (this.#isFetching) return;
    this.#isFetching = true;
    this.projectService
      .getProjects(page, 20)
      .pipe(finalize(() => (this.#isFetching = false)))
      .subscribe((projects) => {
        this.projects =
          page === 1
            ? projects.data
            : [...(this.projects ?? []), ...projects.data];
        this.maxProjects = projects.meta.total;
      });
  }

  #getInvitationAmount() {
    this.userService.getInvitations(1, 1).subscribe((invitations) => {
      this.invitationNumber = invitations.meta.total;
    });
  }
}
