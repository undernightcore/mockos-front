import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { ProjectInterface } from '../../../../interfaces/project.interface';
import { UserInterface } from '../../../../interfaces/user.interface';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  projectId?: number;
  project?: ProjectInterface;
  members?: UserInterface[];
  maxMembers = 0;
  #isFetching = false;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.#getProject();
    });
  }

  handleScroll(event: Event) {
    if (!this.members) return;
    const { scrollTop, scrollHeight, offsetHeight } =
      event.target as HTMLElement;
    if (
      scrollHeight - (scrollTop + offsetHeight) > 200 ||
      this.members.length >= this.maxMembers
    )
      return;
    const pageToRequest = this.members.length / 20 + 1;
    this.#getMemberList(pageToRequest);
  }

  #getProject() {
    if (this.projectId === undefined) return;
    this.projectService.getProject(this.projectId).subscribe((project) => {
      this.project = project;
      this.#getMemberList(1);
    });
  }

  #getMemberList(page: number) {
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
