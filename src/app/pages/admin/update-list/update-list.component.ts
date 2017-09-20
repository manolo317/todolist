import { Component, OnInit, OnDestroy } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from './../../../auth/auth.service';
import { ApiService } from './../../../core/api.service';
import { UtilsService } from './../../../core/utils.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ListModel } from './../../../core/models/list.model';

@Component({
    selector: 'app-update-list',
    templateUrl: './update-list.component.html',
    styleUrls: ['update-list.component.scss']
})
export class UpdateListComponent implements OnInit, OnDestroy {
    pageTitle = 'Update List';
    routeSub: Subscription;
    listSub: Subscription;
    list: ListModel;
    loading: boolean;
    error: boolean;
    private _id: string;
    tabSub: Subscription;
    tab: string;

    constructor(
        private route: ActivatedRoute,
        public auth: AuthService,
        private api: ApiService,
        public utils: UtilsService,
        private title: Title) { }

    ngOnInit() {
        this.title.setTitle(this.pageTitle);

        // Set list ID from route params and subscribe
        this.routeSub = this.route.params
            .subscribe(params => {
                this._id = params['id'];
                this._getList();
            });

        // Subscribe to query params to watch for tab changes
        this.tabSub = this.route.queryParams
            .subscribe(queryParams => {
                this.tab = queryParams['tab'] || 'edit';
            });
    }

    private _getList() {
        this.loading = true;
        // GET event by ID
        this.listSub = this.api
            .getListById$(this._id)
            .subscribe(
                res => {
                    this.list = res;
                    this.loading = false;
                },
                err => {
                    console.error(err);
                    this.loading = false;
                    this.error = true;
                }
            );
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
        this.listSub.unsubscribe();
        this.tabSub.unsubscribe();
    }

}
