import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { ListComponent } from './pages/list/list.component';
import { CreateListComponent } from './pages/admin/create-list/create-list.component';
import { UpdateListComponent } from './pages/admin/update-list/update-list.component';
import { AuthGuard } from './auth/auth.guard';
import { AdminGuard } from './auth/admin.guard';


const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'list/new',
    component: CreateListComponent
  },
  {
    path: 'list/update/:id',
    component: UpdateListComponent
  },
  {
    path: 'list/:id',
    component: ListComponent,
    canActivate: [
      AuthGuard
    ]
  },
  {
    path: 'callback',
    component: CallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  providers: [
    AuthGuard,
    AdminGuard
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
