import { Component, Input } from '@angular/core';
import { AuthService } from './../../../auth/auth.service';
import { UtilsService } from './../../../core/utils.service';
import { ListModel } from './../../../core/models/list.model';

@Component({
  selector: 'app-list-detail',
  templateUrl: './list-detail.component.html',
  styleUrls: ['./list-detail.component.scss']
})
export class ListDetailComponent {
  @Input() list: ListModel;

  constructor(
      public utils: UtilsService,
      public auth: AuthService) { }

}
