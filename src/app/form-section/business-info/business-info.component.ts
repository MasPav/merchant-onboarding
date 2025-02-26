import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WizardService } from 'src/app/core/wizard.service';

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

  ngOnInit() {}

  setAverageMonthlyTrans(category: averageMonthlyTransCategories) {
    this.averageMonthlyTransCategory = category;
    this.form.setValue({averageMonthlyTransValue: category})
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

}
