import { NgModule } from '@angular/core';
import { FormInputComponent } from './form-input/form-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { IconsModule } from '../icons/icons.module';
import { DefaultImageDirective } from './default-image.directive';
import { PikadayPickerComponent } from './pikaday-picker/pikaday-picker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    IconsModule
  ],
  declarations: [FormInputComponent, PikadayPickerComponent, DefaultImageDirective],
  exports: [ReactiveFormsModule, CommonModule, NgSelectModule, IconsModule, FormInputComponent, PikadayPickerComponent, DefaultImageDirective]
})
export class SharedModule { }
