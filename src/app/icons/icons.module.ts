import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { AlertCircle, AlertTriangle, Archive, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2, Loader } from 'angular-feather/icons';

const icons = {AlertCircle, AlertTriangle, Archive, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Trash2, Loader }

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
