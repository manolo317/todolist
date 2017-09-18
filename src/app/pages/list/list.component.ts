import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../auth/auth.service';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ListModel } from './../../core/models/list.model';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {
  pageTitle: string;
  id: string;
  routeSub: Subscription;
  listSub: Subscription;
  list: ListModel;
  loading: boolean;
  error: boolean;

  constructor(
      private route: ActivatedRoute,
      public auth: AuthService,
      private api: ApiService,
      public utils: UtilsService,
      private title: Title) { }

  ngOnInit() {
    // Set list ID from route params and subscribe
    this.routeSub = this.route.params
        .subscribe(params => {
          this.id = params['id'];
          this._getList();
        });
  }

  private _getList() {
    this.loading = true;
    // GET list by ID
    this.listSub = this.api
        .getListById$(this.id)
        .subscribe(
            res => {
              this.list = res;
              this._setPageTitle(this.list.title);
              this.loading = false;
            },
            err => {
              console.error(err);
              this.loading = false;
              this.error = true;
              this._setPageTitle('List Details');
            }
        );
  }

  private _setPageTitle(title: string) {
    this.pageTitle = title;
    this.title.setTitle(title);
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.listSub.unsubscribe();
  }

}
