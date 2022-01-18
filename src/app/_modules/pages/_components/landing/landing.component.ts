import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  @ViewChild('drawer') drawer: MatDrawer;
  constructor() { }

  toggleDrawerState(isOpen: boolean = false) {
    isOpen? this.drawer.close(): this.drawer.open();
  }
}
