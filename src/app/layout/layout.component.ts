import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="h-screen flex flex-wrap md:flex-nowrap">
      <div class="md:w-2/6 bg-gradient-primary-to-accent overflow-hidden">
        <app-sidebar></app-sidebar>
      </div>
      <div class="w-full bg-slate-100 overflow-y-auto">
        <div class="h-[90%]">
          <app-main></app-main>
        </div>
        <div class="h-[10%]">
          <app-footer></app-footer>
        </div>
      </div>
    </div>
  `,
})
export class LayoutComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
