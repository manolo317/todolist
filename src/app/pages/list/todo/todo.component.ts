import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { FilterSortService } from './../../../core/filter-sort.service';
import { TodoModel } from './../../../core/models/todo.model';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  @Input() listId: string;
  @Input() listPast: boolean;
  todosSub: Subscription;
  todos: TodoModel[];
  loading: boolean;
  error: boolean;
  userTodo: TodoModel;
  totalTodos: number;
  showAllTodos = false;
  showTodosText = 'View All TODOs';

  constructor(
      public auth: AuthService,
      private api: ApiService,
      public utils: UtilsService,
      public fs: FilterSortService) { }

  ngOnInit() {
    this._getTODOs();
  }

  private _getTODOs() {
    this.loading = true;
    // Get RSVPs by event ID
    this.todosSub = this.api
        .getTodosByListId$(this.listId)
        .subscribe(
            res => {
              this.todos = res;
              this._updateTodoState();
              this.loading = false;
            },
            err => {
              console.error(err);
              this.loading = false;
              this.error = true;
            }
        );
  }

  private _updateTodoState() {
    // @TODO: We will add more functionality here later
    this._setUserTodoGetAttending();
  }

  private _setUserTodoGetAttending() {
    // Iterate over TODOs to get/set user's todos
    // and get total number of attending guests
    let todos = 0;
    const todoArr = this.todos.map(todo => {
      // If user has an existing RSVP
      if (todo.userId === this.auth.userProfile.sub) {
        this.userTodo = todo;
      }
      // Count total number of attendees
      // + additional guests
      if (todo) {
        todos++;
      }
      return todo;
    });
    this.todos = todoArr;
    this.totalTodos = todos;
  }

  ngOnDestroy() {
    this.todosSub.unsubscribe();
  }

}
