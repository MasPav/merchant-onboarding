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
  documentCategories = { 'ghanaCard': 'Ghana Card of All Company Directors (Foreigners can provide their passports)', 'regulatorLicence': 'Licence From Regulator (where applicable)', 'operationLicence': 'Licence To Operate Product (where applicable)', 'ownershipStructure': 'Ownership structure and documentation such as the Shareholders Register (where applicable)'};
  selectedCategory: any = null;
  uploadedFiles: { [key: string]: { name: string; url: string } } = {};
  fileValidationTriggered: boolean = false;
  constructor(public wizardService: WizardService) { }

  ngOnInit() { }

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

  onFileSelected(event: Event, categoryKey: string) {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files.length > 0) {
      const file = fileInput.files[0];
      this.uploadedFiles[categoryKey] = {
        name: file.name,
        url: URL.createObjectURL(file)
      };
    }
  }
  
  removeFile(categoryKey: string) {
    delete this.uploadedFiles[categoryKey];
  }
  
  saveAllFiles() {
    const filesArray = Object.entries(this.uploadedFiles).map(([category, fileData]) => ({
      category,
      file: fileData.url
    }));
    console.log('Files to be saved:', filesArray);
  }
}
