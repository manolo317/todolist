import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';
import { ENV } from './env.config';
import { ListModel } from './models/list.model';
import { TodoModel } from './models/todo.model';

@Injectable()
export class ApiService {

  constructor(
      private http: HttpClient,
      private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  // GET lists
  getLists$(): Observable<ListModel[]> {
    return this.http
        .get(`${ENV.BASE_API}lists`, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
  }

  // GET a list by ID (login required)
  getListById$(id: string): Observable<ListModel> {
    return this.http
        .get(`${ENV.BASE_API}list/${id}`, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
  }

  // GET TODOs by list ID (login required)
  getTodosByListId$(listId: string): Observable<TodoModel[]> {
    return this.http
        .get(`${ENV.BASE_API}list/${listId}/todos`, {
          headers: new HttpHeaders().set('Authorization', this._authHeader)
        })
        .catch(this._handleError);
  }

    // POST new TODOModel (login required)
    postTodo$(todo: TodoModel): Observable<TodoModel> {
        return this.http
            .post(`${ENV.BASE_API}todo/new`, todo, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

    // PUT existing TODOModel (login required)
    editTodo$(id: string, todo: TodoModel): Observable<TodoModel> {
        return this.http
            .put(`${ENV.BASE_API}todo/${id}`, todo, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

    // DELETE existing todoElement
    deleteTodo$(id: string): Observable<any> {
        return this.http
            .delete(`${ENV.BASE_API}todo/${id}`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

    // POST new list (admin only)
    postList$(list: ListModel): Observable<ListModel> {
        return this.http
            .post(`${ENV.BASE_API}list/new`, list, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

    // PUT existing list (admin only)
    editList$(id: string, list: ListModel): Observable<ListModel> {
        return this.http
            .put(`${ENV.BASE_API}list/${id}`, list, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

    // DELETE existing list and all associated Todos (admin only)
    deleteList$(id: string): Observable<any> {
        return this.http
            .delete(`${ENV.BASE_API}list/${id}`, {
                headers: new HttpHeaders().set('Authorization', this._authHeader)
            })
            .catch(this._handleError);
    }

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

}