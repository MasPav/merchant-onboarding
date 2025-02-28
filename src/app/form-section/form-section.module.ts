import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SharedModule } from "../shared/shared.module";
import { PreviewComponent } from './preview/preview.component';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { BusinessInfoComponent } from './business-info/business-info.component';
import { FormDocumentsComponent } from './form-documents/form-documents.component';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    SharedModule,
],
  declarations: [BasicInfoComponent, BusinessInfoComponent, FormDocumentsComponent, PreviewComponent],
  exports: [BasicInfoComponent, BusinessInfoComponent, FormDocumentsComponent, PreviewComponent]
})
export class FormSectionModule {}
