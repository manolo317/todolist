import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
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
  @Output() submitTodo = new EventEmitter()
  todosSub: Subscription;
  deleteSub: Subscription;
  todos: TodoModel[];
  loading: boolean;
  error: boolean;
  todo: TodoModel;
  isEdit: boolean;
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
    this.isEdit = !!this.todo;
  }

  private _getTODOs() {
    this.loading = true;
    // Get RSVPs by event ID
    this.todosSub = this.api
        .getTodosByListId$(this.listId)
        .subscribe(
            res => {
              this.todos = res;
              this.loading = false;
            },
            err => {
              console.error(err);
              this.loading = false;
              this.error = true;
            }
        );
  }

  addTodo(title: string): void {
    this.todo = new TodoModel(
        this.auth.userProfile.sub,
        title.trim(),
        this.listId,
        false,
        null
    );
    if(!title) { return; }
    this.api.postTodo$(this.todo)
        .subscribe(
            data => this._handleSubmitSuccess(data),
            err => this._handleSubmitError(err)
        )
  }

  deleteTodo(todo: TodoModel) {
    console.log(todo);
    this.deleteSub = this.api
        .deleteTodo$(todo._id)
        .subscribe(
            res => {
              this.error = false;
              this.todos = this.todos.filter(t => t !== todo);
              console.log(res.message);
            },
            err => {
              console.log(err);
              this.error = true;
            }
        );
  }

  private _handleSubmitSuccess(res) {
    const eventObj = {
      isEdit: this.isEdit,
      todo: res
    };
    this.submitTodo.emit(eventObj);
    this.todos.push(this.todo);
    this.error = false;
  }

  private _handleSubmitError(err) {
    const eventObj = {
      isEdit: this.isEdit,
      error: err
    };
    this.submitTodo.emit(eventObj);
    console.error(err);
    this.error = true;
  }


  ngOnDestroy() {
    this.todosSub.unsubscribe();
    this.deleteSub.unsubscribe();
  }

}
