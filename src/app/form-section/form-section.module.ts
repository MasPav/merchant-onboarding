import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BasicInfoComponent } from './basic-info/basic-info.component';
import { CoreModule } from '../core/core.module';
import { SharedModule } from "../shared/shared.module";
import { BusinessInfoComponent } from './business-info/business-info.component';

@NgModule({
  imports: [
    SharedModule,
],
  declarations: [BasicInfoComponent, BusinessInfoComponent],
  exports: [BasicInfoComponent, BusinessInfoComponent]
})
export class FormSectionModule {}
