import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DocumentKey, TransactionValue } from 'src/app/core/types';
import { WizardService } from 'src/app/core/wizard.service';
import { FormGroup } from '@angular/forms';

interface AvailableCategory { code: string, description: string, required: boolean }
@Component({
  selector: 'app-form-documents',
  templateUrl: './form-documents.component.html',
  styleUrls: ['./form-documents.component.css']
})
export class FormDocumentsComponent implements OnInit {

  @ViewChild('fileUploader') fileUploader!: ElementRef;
  @Input() averageMonthlyTransValue!: TransactionValue;
  @Input() form!: FormGroup;

  documentCategories: Record<DocumentKey, { name: string; required: boolean }> = {
    ghana_card: {
      name: "Ghana Card of All Company Directors (Foreigners can provide their passports)",
      required: false,
    },
    operation_license: {
      name: "Metropolitan, Municipal or District Assembly license to operate, or a tax receipt",
      required: true,
    },
    product_service_description: {
      name: "Product/Service Description Document",
      required: false,
    },
    business_registration: {
      name: "Business Registration Documents (Certificate to commence business and incorporation or Certificate of Registration)",
      required: false,
    },
    directors_identification: {
      name: "Ghana Card of all company directors. Foreigners can provide their passport",
      required: true,
    },
    ownership_structure: {
      name: "Ownership structure and documentation such as the Shareholders Register (where applicable)",
      required: false,
    },
    regulator_license: {
      name: "Licence From Regulator (where applicable)",
      required: true,
    },
    product_description: {
      name: "Product Description",
      required: false,
    },
    aml_fraud_policy: {
      name: "AML/Fraud Policy Document",
      required: true,
    },
    data_protection_certificate: {
      name: "Data Protection Certificate",
      required: false,
    },
    vulnerability_test_report: {
      name: "Vulnerability and Penetration Test Report",
      required: true,
    },
    due_diligence: {
      name: "Due Diligence Form",
      required: false,
    },
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
  availableCategoriesCopy: AvailableCategory[] = []; 
  uploadedFiles: { [key: string]: { name: string; url: string } } | any = null;

  constructor(public wizardService: WizardService) { }

  ngOnInit() {
    this.uploadedFiles = this.form.value.uploaded_documents;
    this.filterDocumentsByTransactionValue();
  }

  filterDocumentsByTransactionValue() {
    this.availableCategories = this.documentRequirements[this.averageMonthlyTransValue].map(code => ({
      code,
      description: this.documentCategories[code].name,
      required: this.documentCategories[code].required
    }));
    this.availableCategoriesCopy = [...this.availableCategories];
    this.setUploadedDocs();
  }
  

  onSelectCategory(category: any) {
    this.selectedCategory = category;
  }

  isNextDisabled(): boolean {
    const requiredDocs = this.availableCategories.filter(cat => cat.required);
    return requiredDocs.some(cat => !this.uploadedFiles[cat.code]);
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
    if (!category) return;
    const categoryKey = category.code;
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
  
      if (!this.uploadedFiles) this.uploadedFiles = {};
      this.uploadedFiles[categoryKey] = {
        name: file.name,
        url: URL.createObjectURL(file),
        categoryValue: category.description
      };
      this.availableCategories = this.availableCategories.filter(cat => cat.code !== categoryKey);
      this.selectedCategory = null;
      this.form.get('uploaded_documents')?.setValue(this.uploadedFiles);
      this.form.get('uploaded_documents')?.updateValueAndValidity();
    }
  }
  
  removeFile(categoryKey: string) {
    const removed = this.uploadedFiles[categoryKey];
    if (!removed) return;
    delete this.uploadedFiles[categoryKey];
    this.availableCategories.push({
      code: categoryKey,
      description: this.documentCategories[categoryKey as DocumentKey].name,
      required: this.documentCategories[categoryKey as DocumentKey].required
    });
    this.form.get('uploaded_documents')?.setValue(this.uploadedFiles);
    this.form.get('uploaded_documents')?.updateValueAndValidity();
  }
  

  extractFileNameFromUrl(url: string): string {
    return url.split("/").pop() || "document.pdf";
  }

  setUploadedDocs() {
    if (!this.uploadedFiles) {
      this.uploadedFiles = {};
    }

    if (Array.isArray(this.uploadedFiles)) {
      const formattedDocs: Record<string, any> = {};
  
      this.uploadedFiles.forEach((doc: any) => {
        const categoryValue = this.documentCategories[doc.code as DocumentKey];
  
        if (categoryValue) {
          formattedDocs[doc.code] = {
            name: this.extractFileNameFromUrl(doc.url),
            url: doc.url,
            categoryValue
          };
        }
      });
  
      this.uploadedFiles = formattedDocs;
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