import { Component, OnDestroy, Input } from '@angular/core';
import { ListModel } from './../../../../core/models/list.model';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../../core/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-list',
  templateUrl: './delete-list.component.html',
  styleUrls: ['delete-list.component.scss']
})
export class DeleteListComponent implements OnDestroy {
  @Input() list: ListModel;
  confirmDelete: string;
  deleteSub: Subscription;
  submitting: boolean;
  error: boolean;

  constructor(
      private api: ApiService,
      private router: Router) { }

  removeList() {
    this.submitting = true;
    // DELETE list by ID
    this.deleteSub = this.api
        .deleteList$(this.list._id)
        .subscribe(
            res => {
              this.submitting = false;
              this.error = false;
              console.log(res.message);
              // If successfully deleted list, redirect to Admin
              this.router.navigate(['/']);
            },
            err => {
              console.error(err);
              this.submitting = false;
              this.error = true;
            }
        );
  }

  ngOnDestroy() {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }

}
