import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconsModule } from '../icons/icons.module';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  imports: [
    CommonModule,
    IconsModule,
    HttpClientModule,
    NgSelectModule
  ],
  declarations: [],
  exports: []
})
export class CoreModule { }
