import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';

type FormInputTypes = 'text'|'number'|'email'|'date';

@Component({
  selector: 'form-input',
  templateUrl: './form-input.component.html',
  styleUrls: ['./form-input.component.css']
})
export class FormInputComponent implements OnInit {

  @Input() type!: FormInputTypes;
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() controlName: string = '';
  @Input() group!: FormGroup;
  constructor() { }

  ngOnInit() {
  }

  get formControl(): FormControl {
    return this.group.get(this.controlName) as FormControl;
  }

  get isRequired() {
    return this.formControl.hasValidator(Validators.required);
  }

}
