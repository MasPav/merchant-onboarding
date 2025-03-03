import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2 } from 'angular-feather/icons';

const icons = {CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2 }

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FeatherModule.pick(icons)
  ],
  exports: [
    FeatherModule
  ]
})
export class IconsModule { }
