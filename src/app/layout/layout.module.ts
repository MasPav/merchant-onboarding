import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { IconsModule } from '../icons/icons.module';
import { FormSectionModule } from '../form-section/form-section.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    FormSectionModule
  ],
  declarations: [LayoutComponent, SidebarComponent, MainComponent, FooterComponent]
})
export class LayoutModule { }
