import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { ProjectInterface } from '../../interfaces/project.interface';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  projects: ProjectInterface[] = [];
  maxProjects = 0;
  #isFetching = false;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.#getProjects(1);
  }

  handleScroll(event: Event) {
    const { scrollTop, scrollHeight, offsetHeight } =
      event.target as HTMLElement;
    if (
      scrollHeight - (scrollTop + offsetHeight) > 200 ||
      this.projects.length >= this.maxProjects
    )
      return;
    const pageToRequest = this.projects.length / 20 + 1;
    this.#getProjects(pageToRequest);
  }

  #getProjects(page: number) {
    if (this.#isFetching) return;
    this.#isFetching = true;
    this.projectService
      .getProjects(page, 20)
      .pipe(finalize(() => (this.#isFetching = false)))
      .subscribe((projects) => {
        this.projects =
          page === 1 ? projects.data : [...this.projects, ...projects.data];
        this.maxProjects = projects.meta.total;
      });
  }
}
