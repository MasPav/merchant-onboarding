import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentKey, TransactionValue } from 'src/app/core/types';
import { WizardService } from 'src/app/core/wizard.service';
import { FormGroup } from '@angular/forms';

interface AvailableCategory { code: string, description: string }
@Component({
  selector: 'app-form-documents',
  templateUrl: './form-documents.component.html',
  styleUrls: ['./form-documents.component.css']
})
export class FormDocumentsComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader!: ElementRef;
  @Input() averageMonthlyTransValue!: TransactionValue;
  @Input() form!: FormGroup;

  documentCategories: Record<DocumentKey, string> = {
    "ghana_card": "Ghana Card of All Company Directors (Foreigners can provide their passports)",
    "operation_license": "Metropolitan, Municipal or District Assembly license to operate, or a tax receipt",
    "product_service_description": "Product/Service Description Document",
    "business_registration": "Business Registration Documents (Certificate to commence business and incorporation or Certificate of Registration)",
    "directors_identification": "Ghana Card of all company directors. Foreigners can provide their passport",
    "ownership_structure": "Ownership structure and documentation such as the Shareholders Register (where applicable)",
    "regulator_license": "Licence From Regulator (where applicable)",
    "product_description": "Product Description",
    "aml_fraud_policy": "AML/Fraud Policy Document",
    "data_protection_certificate": "Data Protection Certificate",
    "vulnerability_test_report": "Vulnerability and Penetration Test Report",
    "due_diligence": "Due Diligence Form"
  };

  documentRequirements: Record<TransactionValue, DocumentKey[]> = {
    growing: ["ghana_card", "operation_license", "product_service_description"],
    established: ["ghana_card", "operation_license", "product_service_description"],
    matured: [
      "business_registration", "ghana_card", "ownership_structure", "operation_license",
      "product_description", "aml_fraud_policy", "data_protection_certificate",
      "vulnerability_test_report", "due_diligence"
    ]
  };

  selectedCategory: any = null;
  fileValidationTriggered: boolean = false;
  availableCategories: AvailableCategory[] = [];
  uploadedFiles: { [key: string]: { name: string; url: string } } | any = null;

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
    this.uploadedFiles = this.form.value.uploaded_documents;
    this.filterDocumentsByTransactionValue();
  }

  filterDocumentsByTransactionValue() {
    this.availableCategories = this.documentRequirements[this.averageMonthlyTransValue].map(key => ({
      code: key,
      description: this.documentCategories[key]
    }));
    this.setUploadedDocs();
  }

  onSelectCategory(category: any) {
    this.selectedCategory = category;
  }

  isNextDisabled(): boolean {
    return Object.keys(this.uploadedFiles).length < this.availableCategories.length;
  }

  onNavNext() {
    if (this.isNextDisabled()) {
      this.fileValidationTriggered = true;
    } else {
      this.setUploadedDocs();
      this.wizardService.markSectionAsCompleted(this.wizardService.selectedSection);
      this.wizardService.moveToNextSection();
    }
  }

  onFileSelected(event: Event, category: AvailableCategory) {
    const categoryKey = category.code
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      !this.uploadedFiles ? this.uploadedFiles = {} : '';
      this.uploadedFiles[categoryKey] = {
        name: file.name,
        url: URL.createObjectURL(file),
        categoryValue: category.description
      };
    }
  }

  removeFile(categoryKey: string) {
    delete this.uploadedFiles[categoryKey];
  }

  setUploadedDocs() {
    if (!this.uploadedFiles) {
      this.uploadedFiles = {};
    }

    const validKeys = new Set(this.availableCategories.map(category => category.code));
    const filteredFiles = Object.fromEntries(
      Object.entries(this.uploadedFiles).filter(([key]) => validKeys.has(key))
    );
    this.uploadedFiles = filteredFiles;
    
    this.form.get('uploaded_documents')?.setValue(this.uploadedFiles);
    this.form.get('uploaded_documents')?.updateValueAndValidity();
  }
}