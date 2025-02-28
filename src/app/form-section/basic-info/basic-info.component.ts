import { Component, Input, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { FormControl, FormGroup, Validators } from '@angular/forms';
import { WizardService } from 'src/app/core/wizard.service';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css']
})
export class BasicInfoComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() countries: any[] = [];
  hasSupportContact: boolean = false;

  constructor(private http: HttpClient, private wizardService: WizardService) {}

  ngOnInit() {
    this.form.get("support_contact")?.valueChanges.subscribe((value) => {
      this.hasSupportContact = value;
      this.toggleSupportContactFields(value);
    });
  }

  getFormControl(controlName: string): FormControl {
    return this.form.get(controlName) as FormControl;
  }

  onNavNext() {
    const isValid = this.validateForm();
    if(isValid) {
      this.wizardService.markSectionAsCompleted(this.wizardService.selectedSection);
      this.wizardService.moveToNextSection();
    }
  }

  validateForm(): boolean {
    Object.keys(this.form.controls).forEach(key => {
      this.form.get(key)?.markAsDirty();
      this.form.get(key)?.markAsTouched();
    });
    return this.form.valid
  }

  toggleSupportContactFields(toggled: boolean) {
    if (toggled) {
      this.form.addControl("support_surname", new FormControl(null, Validators.required));
      this.form.addControl("support_othernames", new FormControl(null, Validators.required));
      this.form.addControl("support_email", new FormControl(null, [Validators.required, Validators.email]));
      this.form.addControl("support_dial_code", new FormControl('+233', [Validators.required]));
      this.form.addControl("support_msisdn", new FormControl(null, Validators.required));
    } else {
      this.form.removeControl("support_surname");
      this.form.removeControl("support_othernames");
      this.form.removeControl("support_email");
      this.form.removeControl("support_dial_code");
      this.form.removeControl("support_msisdn");
    }
  }
}
