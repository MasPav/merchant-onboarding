import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-layout',
  template: `
    <div class="min-h-screen flex">
      <div class="w-2/6 bg-gradient-primary-to-accent">
        <app-sidebar></app-sidebar>
      </div>
      <div class="w-full bg-slate-100">
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
