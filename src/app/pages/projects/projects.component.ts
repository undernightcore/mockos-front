import {
  AfterViewInit,
  Component,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  iif,
  map,
  Observable,
  scan,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
  tap,
} from 'rxjs';
import { ChoiceModalComponent } from '../../components/choice-modal/choice-modal.component';
import { ForkedProjectInterface } from '../../interfaces/project.interface';
import { AppManagerService } from '../../services/app/app-manager.service';
import { ProjectService } from '../../services/project/project.service';
import { RealtimeService } from '../../services/realtime/realtime.service';
import { openToast } from '../../utils/toast.utils';
import { ProjectModalComponent } from './components/project-modal/project-modal.component';
import { LayoutService } from '../../services/layout/layout.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements AfterViewInit {
  @ViewChild('actions') private actions?: TemplateRef<HTMLDivElement>;

  filters = new FormGroup({
    sort: new FormControl('created_at'),
    onlyBranches: new FormControl('false'),
  });

  triggerNewPage$ = new Subject<number>();
  projects$: Observable<{ projects: ForkedProjectInterface[]; total: number }> =
    this.realtimeService.listenUserProjects().pipe(
      debounceTime(50),
      startWith(true),
      switchMap(() =>
        this.filters.valueChanges.pipe(
          startWith(this.filters.value),
          switchMap((filters) =>
            this.triggerNewPage$.pipe(
              startWith(1),
              distinctUntilChanged(
                (previous, current) => previous === current && current !== 1
              ),
              tap((page) => page === 1 && this.selectedProjects.clear()),
              switchMap((page) =>
                this.projectService.getProjects(
                  page,
                  20,
                  filters.sort ?? 'created_at',
                  filters.sort === 'name' ? 'asc' : 'desc',
                  filters.onlyBranches ?? 'false'
                )
              ),
              scan(
                (acc, value) => ({
                  projects:
                    value.meta.current_page !== 1
                      ? [...acc.projects, ...value.data]
                      : value.data,
                  total: value.meta.total,
                }),
                { projects: [] as ForkedProjectInterface[], total: 0 }
              )
            )
          )
        )
      ),
      shareReplay(1)
    );

  selectedProjects = new Set<number>();

  showProjectsAsList$ = this.layoutService.showProjectsAsList.pipe(
    shareReplay(1)
  );

  constructor(
    private appManager: AppManagerService,
    private projectService: ProjectService,
    private dialogService: MatDialog,
    private translateService: TranslateService,
    private realtimeService: RealtimeService,
    private layoutService: LayoutService
  ) {}

  ngAfterViewInit() {
    this.appManager.setHeaderData({
      breadcrumb: [{ label: 'PAGES.HOME.TITLE' }],
      actions: this.actions,
    });
  }

  selectProjects(projects: ForkedProjectInterface[]) {
    this.selectedProjects.clear();
    for (const project of projects) {
      this.selectedProjects.add(project.id);
    }
  }

  openDeleteMultipleModal() {
    this.projects$
      .pipe(
        map((data) =>
          data.projects.filter((project) =>
            this.selectedProjects.has(project.id)
          )
        ),
        take(1),
        filter((list) => Boolean(list.length)),
        switchMap((projectList) =>
          this.dialogService
            .open(ChoiceModalComponent, {
              data: {
                title: this.translateService.instant(
                  `PAGES.DASHBOARD.DELETE_PROJECT${
                    projectList.length > 1 ? '_MULTIPLE' : ''
                  }`
                ),
                message: this.translateService.instant(
                  `PAGES.DASHBOARD.DELETE_PROJECT_MESSAGE${
                    projectList.length > 1 ? '_MULTIPLE' : ''
                  }`,
                  {
                    project: projectList[0].name,
                    projects: projectList
                      .map((project) => project.name)
                      .join(', '),
                  }
                ),
                type: 'destructive',
                confirmLabel: this.translateService.instant('ACTIONS.DELETE'),
              },
              autoFocus: false,
              minWidth: '450px',
              maxWidth: '450px',
            })
            .afterClosed()
            .pipe(
              filter((confirmed) => confirmed),
              switchMap(() =>
                forkJoin(
                  projectList.map((project) =>
                    this.projectService.deleteProject(project.id)
                  )
                )
              )
            )
        )
      )
      .subscribe();
  }

  openDeleteModal(project: ForkedProjectInterface) {
    this.dialogService
      .open(ChoiceModalComponent, {
        data: {
          title: this.translateService.instant(
            `PAGES.DASHBOARD.DELETE_PROJECT`
          ),
          message: this.translateService.instant(
            `PAGES.DASHBOARD.DELETE_PROJECT_MESSAGE`,
            {
              project: project.name,
            }
          ),
          type: 'destructive',
          confirmLabel: this.translateService.instant('ACTIONS.DELETE'),
        },
        autoFocus: false,
        minWidth: '450px',
        maxWidth: '450px',
      })
      .afterClosed()
      .pipe(
        filter((confirmed) => confirmed),
        switchMap(() => this.projectService.deleteProject(project.id))
      )
      .subscribe();
  }

  openCreateModal(project?: ForkedProjectInterface) {
    this.dialogService
      .open(ProjectModalComponent, {
        data: { project },
        autoFocus: false,
        minWidth: '450px',
        maxWidth: '450px',
      })
      .afterClosed()
      .pipe(
        filter((data) => Boolean(data)),
        switchMap((data) =>
          iif(
            () => !project,
            this.projectService.createProject(data),
            this.projectService.editProject(project?.id as number, data)
          )
        ),
        tap({
          error: (error) =>
            error.error.errors[0] && openToast(error.error.errors[0], 'error'),
          next: (response) => {
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
          },
        })
      )
      .subscribe();
  }

  resetFilters() {
    this.filters.setValue({ onlyBranches: 'false', sort: 'created_at' });
  }

  toggleProjectsAsList(value: boolean) {
    this.layoutService.setShowProjectsAsList(value);
  }
}
