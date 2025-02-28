import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WizardService } from 'src/app/core/wizard.service';

@Component({
  selector: 'app-form-documents',
  templateUrl: './form-documents.component.html',
  styleUrls: ['./form-documents.component.css']
})
export class FormDocumentsComponent implements OnInit {

  @Input() form!: FormGroup;
  documentCategories = { 'ghanaCard': 'Ghana Card of All Company Directors (Foreigners can provide their passports)', 'regulatorLicence': 'Licence From Regulator (where applicable)', 'operationLicence': 'Licence To Operate Product (where applicable)', 'ownershipStructure': 'Ownership structure and documentation such as the Shareholders Register (where applicable)' };
  selectedCategory: any = null;
  constructor(public wizardService: WizardService) { }

  ngOnInit() {
  }

  onSelectCategory(category: any) {
    this.selectedCategory = category;
  }

}
