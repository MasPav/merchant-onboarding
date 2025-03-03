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
  documentCategories = { 'ghana_card': 'Ghana Card of All Company Directors (Foreigners can provide their passports)', 'regulator_licence': 'Licence From Regulator (where applicable)', 'operation_licence': 'Licence To Operate Product (where applicable)', 'ownership_structure': 'Ownership structure and documentation such as the Shareholders Register (where applicable)'};
  selectedCategory: any = null;
  uploadedFiles: { [key: string]: { name: string; url: string } } = {};
  fileValidationTriggered: boolean = false;
  constructor(public wizardService: WizardService) { }

  ngOnInit() { 
    window.onbeforeunload = () => {
      sessionStorage.removeItem('uploadedFiles');
    };
    this.loadUploadedFiles();
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

  saveUploadedFiles() {
    const filesToSave = Object.keys(this.uploadedFiles).reduce((acc, key) => {
      acc[key] = this.uploadedFiles[key].name;
      return acc;
    }, {} as { [key: string]: string });

    sessionStorage.setItem('uploadedFiles', JSON.stringify(filesToSave));
  }

  loadUploadedFiles() {
    const savedFiles = sessionStorage.getItem('uploadedFiles');
    if (savedFiles) {
      this.uploadedFiles = JSON.parse(savedFiles);
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
      this.saveUploadedFiles();
      if (this.form.get(categoryKey)) {
        this.form.get(categoryKey)?.setValue(URL.createObjectURL(file));
      }
      console.log(this.form.value)
    }
  }
  
  removeFile(categoryKey: string) {
    delete this.uploadedFiles[categoryKey];
    this.saveUploadedFiles();
  }
  
  saveAllFiles() {
    const filesArray = Object.entries(this.uploadedFiles).map(([category, fileData]) => ({
      category,
      file: fileData.url
    }));
    console.log('Files to be saved:', filesArray);
  }
}
