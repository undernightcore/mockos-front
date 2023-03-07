import { Component, OnInit } from '@angular/core';
import { RoutesService } from '../../../../services/routes.service';
import { RouteInterface } from '../../../../interfaces/route.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.scss'],
})
export class RoutesComponent implements OnInit {
  routes?: RouteInterface[];
  projectId?: number;

  constructor(
    private routesService: RoutesService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.projectId = params['id'];
      this.#getRoutes();
    });
  }

  #getRoutes() {
    if (this.projectId === undefined) return;
    this.routesService.getRoutes(this.projectId).subscribe((routes) => {
      this.routes = routes.data;
    });
  }
}
