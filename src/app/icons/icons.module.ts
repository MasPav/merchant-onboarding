import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { AlertCircle, AlertTriangle, Archive, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Search, Trash2, Loader, Package } from 'angular-feather/icons';

const icons = {AlertCircle, AlertTriangle, Archive, CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft, Upload, Check, Search, Trash2, Loader, Package }

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
