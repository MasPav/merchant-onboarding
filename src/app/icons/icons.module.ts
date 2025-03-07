import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { AlertCircle, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2 } from 'angular-feather/icons';

const icons = {AlertCircle, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2 }

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
