import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { ApiService } from './../../../core/api.service';
import { ListModel, FormListModel } from './../../../core/models/list.model';
import { DatePipe } from '@angular/common';
import { ListFormService } from './list-form.service';

@Component({
  selector: 'app-list-form',
  templateUrl: './list-form.component.html',
  styleUrls: ['list-form.component.scss'],
  providers: [ ListFormService ]
})
export class ListFormComponent implements OnInit, OnDestroy {
  @Input() list: ListModel;
  isEdit: boolean;
  // FormBuilder form
  listForm: FormGroup;
  // Model storing initial form values
  formList: FormListModel;
  // Form validation and disabled logic
  formErrors: any;
  formChangeSub: Subscription;
  // Form submission
  submitListObj: ListModel;
  submitListSub: Subscription;
  error: boolean;
  submitting: boolean;
  submitBtnText: string;

  constructor(
      private fb: FormBuilder,
      private api: ApiService,
      private datePipe: DatePipe,
      public lf: ListFormService,
      private router: Router) { }

  ngOnInit() {
    this.formErrors = this.lf.formErrors;
    this.isEdit = !!this.list;
    this.submitBtnText = this.isEdit ? 'Update List' : 'Create list';
    // Set initial form data
    this.formList = this._setFormList();
    // Use FormBuilder to construct the form
    this._buildForm();
  }

  private _setFormList() {
    if (!this.isEdit) {
      // If creating a new list, create new
      // FormListModel with default null data
      return new FormListModel(null, null, null, null);
    } else {
      // If editing existing list, create new
      // FormListModel from existing data
      return new FormListModel(
          this.list.title,
          this.list.datetime,
          this.list.viewPublic,
          this.list.description
      );
    }
  }

  private _buildForm() {
    this.listForm = this.fb.group({
      title: [this.formList.title, [
        Validators.required,
        Validators.minLength(this.lf.textMin),
        Validators.maxLength(this.lf.titleMax)
      ]],
      viewPublic: [this.formList.viewPublic,
        Validators.required
      ],
      description: [this.formList.description,
        Validators.maxLength(this.lf.descMax)
      ]
    });

    // Subscribe to form value changes
    this.formChangeSub = this.listForm
        .valueChanges
        .subscribe(data => this._onValueChanged());

    // If edit: mark fields dirty to trigger immediate
    // validation in case editing an list that is no
    // longer valid (for example, an list in the past)
    if (this.isEdit) {
      const _markDirty = group => {
        for (const i in group.controls) {
          if (group.controls.hasOwnProperty(i)) {
            group.controls[i].markAsDirty();
          }
        }
      };
      _markDirty(this.listForm);
    }

    this._onValueChanged();
  }

  private _onValueChanged() {
    if (!this.listForm) { return; }
    const _setErrMsgs = (control: AbstractControl, errorsObj: any, field: string) => {
      if (control && control.dirty && control.invalid) {
        const messages = this.lf.validationMessages[field];
        for (const key in control.errors) {
          if (control.errors.hasOwnProperty(key)) {
            errorsObj[field] += messages[key] + '<br>';
          }
        }
      }
    };

    // Check validation and set errors
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
          this.formErrors[field] = '';
          _setErrMsgs(this.listForm.get(field), this.formErrors, field);
      }
    }
  }

  private _getSubmitObj() {

    const newDatetime = new Date();
    // to JS dates and populate a new ListModel for submission
    return new ListModel(
        this.listForm.get('title').value,
        newDatetime,
        this.listForm.get('viewPublic').value,
        this.listForm.get('description').value,
        this.list ? this.list._id : null
    );
  }

  onSubmit() {
    this.submitting = true;
    this.submitListObj = this._getSubmitObj();

    if (!this.isEdit) {
      this.submitListSub = this.api
          .postList$(this.submitListObj)
          .subscribe(
              data => this._handleSubmitSuccess(data),
              err => this._handleSubmitError(err)
          );
    } else {
      this.submitListSub = this.api
          .editList$(this.list._id, this.submitListObj)
          .subscribe(
              data => this._handleSubmitSuccess(data),
              err => this._handleSubmitError(err)
          );
    }
  }

  private _handleSubmitSuccess(res) {
    this.error = false;
    this.submitting = false;
    // Redirect to list detail
    this.router.navigate(['/list', res._id]);
  }

  private _handleSubmitError(err) {
    console.error(err);
    this.submitting = false;
    this.error = true;
  }

  resetForm() {
    this.listForm.reset();
  }

  ngOnDestroy() {
    if (this.submitListSub) {
      this.submitListSub.unsubscribe();
    }
    this.formChangeSub.unsubscribe();
  }

}