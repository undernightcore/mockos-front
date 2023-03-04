import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerificationResultComponent } from './verification-result.component';

const routes: Routes = [
  {
    path: 'success',
    data: { successful: true },
    component: VerificationResultComponent,
  },
  {
    path: 'failure',
    data: { successful: false },
    component: VerificationResultComponent,
  },
  {
    path: '**',
    loadChildren: () =>
      import('../not-found/not-found.module').then((m) => m.NotFoundModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificationResultRoutingModule {}
