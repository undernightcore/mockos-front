import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { VerificationResultComponent } from './pages/verification-result/verification-result.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

const routes: Routes = [
  {
    title: 'Home',
    path: '',
    component: HomeComponent,
  },
  {
    title: 'Verification success',
    path: 'verify/success',
    data: {
      successful: true,
    },
    component: VerificationResultComponent,
  },
  {
    title: 'Verification failed',
    path: 'verify/failure',
    data: {
      successful: false,
    },
    component: VerificationResultComponent,
  },
  {
    title: 'Not found',
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
