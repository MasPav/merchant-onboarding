import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  appName: string = '';
  constructor() {
    this.appName = environment.APP_NAME;
  }

  ngOnInit() {
  }

}
