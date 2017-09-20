import { Injectable } from '@angular/core';

@Injectable()
export class ListFormService {
  validationMessages: any;
  // Set up errors object
  formErrors = {
    title: '',
    viewPublic: '',
    description: ''
  };
  // Min/maxlength validation
  textMin = 3;
  titleMax = 36;
  descMax = 2000;

  constructor() {
    this.validationMessages = {
      title: {
        required: `Title is <strong>required</strong>.`,
        minlength: `Title must be ${this.textMin} characters or more.`,
        maxlength: `Title must be ${this.titleMax} characters or less.`
      },
      viewPublic: {
        required: `You must specify whether this event should be publicly listed.`
      },
      description: {
        maxlength: `Description must be ${this.descMax} characters or less.`
      }
    };
  }

}
