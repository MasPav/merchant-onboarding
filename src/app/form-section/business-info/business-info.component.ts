import { Component, Input, OnInit } from '@angular/core';
import { WizardService } from 'src/app/core/wizard.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

type averageMonthlyTransCategories = 'growing' | 'established' | 'matured';

@Component({
  selector: 'app-business-info',
  templateUrl: './business-info.component.html',
  styleUrls: ['./business-info.component.css']
})
export class BusinessInfoComponent implements OnInit {

  @Input() form!: FormGroup;
  @Input() countries: any[] = [];

  averageMonthlyTransCategory: averageMonthlyTransCategories = 'established';
  avatarImage: string = '';
  companyTypes = ['Partnership', 'Corporation'];
  productTags = ['Vouchers', 'Agents'];

  constructor(public wizardService: WizardService) {}

  ngOnInit() {
    if (this.form.get("averageMonthlyTransValue")?.value) {
      this.averageMonthlyTransCategory = this.form.get("averageMonthlyTransValue")?.value;
    }
    if (this.form.get("logo")?.value) {
      const uploadedFile = this.form.get("logo")?.value;
      this.avatarImage = URL.createObjectURL(uploadedFile);
    }
  }

  setAverageMonthlyTrans(category: averageMonthlyTransCategories) {
    this.averageMonthlyTransCategory = category;
    this.form.patchValue({averageMonthlyTransValue: category});

    if (category === "matured") {
      this.addControls();
    } else {
      this.form.removeControl("tin");
      this.form.removeControl("registration_number");
      this.form.removeControl("date_of_incorporation");
    }

    Object.keys(this.form.controls).forEach((key) => {
      const control = this.form.get(key);
      if (control) {
        control.markAsPristine();
        control.markAsUntouched();
      }
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

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarImage = reader.result as string;
        this.getFormControl("logo").setValue(file);
      };
      reader.readAsDataURL(file);
    }
  }

  private addControls() {
    this.form.addControl("tin", new FormControl(null, Validators.required));
    this.form.addControl("registration_number", new FormControl(null, Validators.required));
    this.form.addControl("date_of_incorporation", new FormControl(null, Validators.required));

    this.form.updateValueAndValidity();
  }
}
