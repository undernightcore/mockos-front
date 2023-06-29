import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { LandingGuard } from '../../guards/landing.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [LandingGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
