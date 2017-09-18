import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ApiService } from './../../core/api.service';
import { UtilsService } from './../../core/utils.service';
import { FilterSortService } from './../../core/filter-sort.service';
import { Subscription } from 'rxjs/Subscription';
import { ListModel } from './../../core/models/list.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  pageTitle = 'Lists';
  listListSub: Subscription;
  listList: ListModel[];
  filteredLists: ListModel[];
  loading: boolean;
  error: boolean;
  query: '';

  constructor(
      private title: Title,
      public utils: UtilsService,
      private api: ApiService,
      public fs: FilterSortService) { }

  ngOnInit() {
    this.title.setTitle(this.pageTitle);
    this._getEventList();
  }

  private _getEventList() {
    this.loading = true;
    // Get future, public events
    this.listListSub = this.api
        .getLists$()
        .subscribe(
            res => {
              this.listList = res;
              this.filteredLists = res;
              this.loading = false;
            },
            err => {
              console.error(err);
              this.loading = false;
              this.error = true;
            }
        );
  }

  searchLists() {
    this.filteredLists = this.fs.search(this.listList, this.query, '_id', 'mediumDate');
  }

  resetQuery() {
    this.query = '';
    this.filteredLists = this.listList;
  }

  ngOnDestroy() {
    this.listListSub.unsubscribe();
  }

}
