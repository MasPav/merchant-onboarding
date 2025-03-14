import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WizardService } from 'src/app/core/wizard.service';
@Component({
  selector: 'app-form-documents',
  templateUrl: './form-documents.component.html',
  styleUrls: ['./form-documents.component.css']
})
export class FormDocumentsComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader!: ElementRef;
  @Input() form!: FormGroup;
  
  documentCategories = {
    "ghana_card": "Ghana Card of All Company Directors (Foreigners can provide their passports)",
    "operation_license": "License To Operate Product (where applicable)",
    "product_service_description": "Product/service description document",
    "tin_number": "Tax Identification Number (TIN)",
    "business_registration": "Business Registration Documents (Certificate to commence business and incorporation or Certificate of Registration)",
    "directors_identification": "Ghana Card of all company directors. Foreigners can provide their passport",
    "ownership_structure": "Ownership structure and documentation such as the Shareholders Register (where applicable)",
    "regulator_license": "Licence From Regulator (where applicable)",
    "product_description": "License to operate product (not compulsory)",
    "aml_fraud_policy": "AML/Fraud Policy Document",
    "data_protection_certificate": "Data Protection Certificate",
    "vulnerability_test_report": "Vulnerability and Penetration Test Report (not compulsory)",
    "due_diligence": "Due Diligence Form (not compulsory)"
  };

  selectedCategory: any = null;
  uploadedFiles: { [key: string]: { name: string; url: string } } | any = {};
  fileValidationTriggered: boolean = false;
  constructor(public wizardService: WizardService) { }

  ngOnInit() {
    if(this.form.value.uploaded_documents){
      const files = this.form.value.uploaded_documents;
      this.uploadedFiles = files.reduce((acc: { [key: string]: { name: string; url: string; categoryValue: string } }, file: { category_name: string; file_name: string; url: string; category: string }) => {
        acc[file.category_name] = { 
          name: file.file_name, 
          url: file.url,
          categoryValue: file.category
        };
        return acc;
      }, {} as { [key: string]: { name: string; url: string; categoryValue: string } });
    }
    console.log(this.form.value)
  }

  onSelectCategory(category: any) {
    this.selectedCategory = category;
  }
  
  isNextDisabled(): boolean {
    const totalCategories = Object.keys(this.documentCategories).length;
    const uploadedFilesCount = Object.keys(this.uploadedFiles).length;
    return uploadedFilesCount < totalCategories;
  }

  onNavNext() {
    const totalCategories = Object.keys(this.documentCategories).length;
    const uploadedFilesCount = Object.keys(this.uploadedFiles).length;
    if (uploadedFilesCount < totalCategories) {
      this.fileValidationTriggered = true;
    } else {
      this.saveAllFiles();
      this.wizardService.markSectionAsCompleted(this.wizardService.selectedSection);
      this.wizardService.moveToNextSection();
    }
  }

  onFileSelected(event: Event, category: {key: any, value:any}) {
    const categoryKey = category.key
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.uploadedFiles[categoryKey] = {
        name: file.name,
        url: URL.createObjectURL(file),
        categoryValue: category.value
      };
    }
  }

  removeFile(categoryKey: string) {
    delete this.uploadedFiles[categoryKey];
  }

    saveAllFiles() {
    const filesArray = Object.entries(this.uploadedFiles).map(([category, fileData]: [string, any]) => ({
      file_name: fileData.name,
      url: fileData.url,
      category_name: category,
      category: fileData.categoryValue
    }));
    this.form.get('uploaded_documents')?.setValue(filesArray);
  }
}