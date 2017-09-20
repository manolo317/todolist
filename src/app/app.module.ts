import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { CallbackComponent } from './pages/callback/callback.component';
import { LoadingComponent } from './core/loading.component';
import { AuthService } from './auth/auth.service';
import { ApiService } from './core/api.service';
import { UtilsService } from './core/utils.service';
import { FilterSortService } from './core/filter-sort.service';
import { ListComponent } from './pages/list/list.component';
import { ListDetailComponent } from './pages/list/list-detail/list-detail.component';
import { TodoComponent } from './pages/list/todo/todo.component';
import { TodoFormComponent } from './pages/list/todo/todo-form/todo-form.component';
import { SubmittingComponent } from './core/forms/submitting.component';
import { CreateListComponent } from './pages/admin/create-list/create-list.component';
import { UpdateListComponent } from './pages/admin/update-list/update-list.component';
import { ListFormComponent } from './pages/admin/list-form/list-form.component';
import { DeleteListComponent } from './pages/admin/update-list/delete-list/delete-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    CallbackComponent,
    LoadingComponent,
    ListComponent,
    ListDetailComponent,
    TodoComponent,
    TodoFormComponent,
    SubmittingComponent,
    CreateListComponent,
    UpdateListComponent,
    ListFormComponent,
    DeleteListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    Title,
    AuthService,
    ApiService,
    UtilsService,
    DatePipe,
    FilterSortService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
