import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from "../shared/shared.module";
import { BusinessInfoComponent } from './business-info/business-info.component';
import { FormDocumentsComponent } from './form-documents/form-documents.component';
import { PreviewComponent } from './preview/preview.component';

@NgModule({
  imports: [
    SharedModule,
],
  declarations: [BasicInfoComponent, BusinessInfoComponent, FormDocumentsComponent, PreviewComponent],
  exports: [BasicInfoComponent, BusinessInfoComponent, FormDocumentsComponent, PreviewComponent]
})
export class FormSectionModule {}
