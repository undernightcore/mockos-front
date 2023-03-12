import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProjectInterface } from '../../../../interfaces/project.interface';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit {
  projectId?: number;
  project?: ProjectInterface;

  constructor(
    private projectService: ProjectService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
    });
    this.#getProject();
  }

  #getProject() {
    if (this.projectId === undefined) return;
    forkJoin([this.projectService.getProject(this.projectId)]).subscribe(
      ([project]) => {
        this.project = project;
      }
    );
  }
}
