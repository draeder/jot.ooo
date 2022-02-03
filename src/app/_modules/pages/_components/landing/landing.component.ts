import { Component, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { TrackerService } from 'src/app/_services/tracker.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  @ViewChild('drawer') drawer: MatDrawer;
  constructor(private trackerService: TrackerService) { 
    this.trackerService.getTrackers().subscribe((response) => {
      console.log('trackers', response);
    });
  }

  toggleDrawerState(isOpen: boolean = false) {
    isOpen? this.drawer.close(): this.drawer.open();
  }
}
