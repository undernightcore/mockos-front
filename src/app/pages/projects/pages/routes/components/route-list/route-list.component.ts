import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, map, startWith, switchMap } from 'rxjs';
import { RouteInterface } from 'src/app/interfaces/route.interface';
import { FolderAndRoutesInterface } from '../../interfaces/folder-and-routes.interface';
import { ProjectManagerService } from '../../services/project.manager';

@Component({
  selector: 'app-route-list',
  templateUrl: './route-list.component.html',
  styleUrls: ['./route-list.component.scss'],
})
export class RouteListComponent {
  searchForm = new FormControl<string>('');

  routes$ = this.searchForm.valueChanges.pipe(
    debounceTime(200),
    startWith(this.searchForm.value),
    switchMap((search) =>
      this.projectManager.folderAndRoutes$.pipe(
        map((routes) =>
          search
            ? routes
                ?.map((route) =>
                  route.is_folder
                    ? {
                        ...route,
                        routes: route.routes.filter(
                          (child) =>
                            child.name
                              .toLowerCase()
                              .includes(search.toLowerCase()) ||
                            child.endpoint
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        ),
                      }
                    : route
                )
                .filter((route) =>
                  route.is_folder
                    ? route.routes.length > 0
                    : route.name.toLowerCase().includes(search.toLowerCase()) ||
                      route.endpoint
                        .toLowerCase()
                        .includes(search.toLowerCase())
                )
            : routes
        )
      )
    )
  );
  selectedRoute$ = this.projectManager.selectedRoute$;

  constructor(private projectManager: ProjectManagerService) {}

  selectRoute(routeId: number) {
    this.projectManager.selectRoute(routeId);
  }

  trackByRoute(_: number, route: RouteInterface | FolderAndRoutesInterface) {
    return route.is_folder ? route.folder.id : route.id;
  }
}
