import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft } from 'angular-feather/icons';

const icons = {CheckCircle, TrendingUp, Award, Star, Image, ArrowRight, ArrowLeft}

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
