import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from './../../../../auth/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { TodoModel } from './../../../../core/models/todo.model';

@Component({
  selector: 'app-todo-form',
  templateUrl: './todo-form.component.html',
  styleUrls: ['todo-form.component.scss']
})
export class TodoFormComponent implements OnInit, OnDestroy {

  @Input() listId: string;
  @Input() todo: TodoModel;
  @Output() submitTodo = new EventEmitter();
  isEdit: boolean;
  formTodo: TodoModel;
  submitTodoSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
      private auth: AuthService,
      private api: ApiService) { }

  ngOnInit() {
    this.isEdit = !!this.todo;
    // this._setFormTodo();
  }


  ngOnDestroy() {
    if (this.submitTodoSub) {
      this.submitTodoSub.unsubscribe();
    }
  }

}
