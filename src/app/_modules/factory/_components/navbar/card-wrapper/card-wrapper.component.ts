import { Component, OnInit } from '@angular/core';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.scss']
})
export class CardWrapperComponent implements OnInit {

  constructor(private gun: GunService, private user: UserService) { }

  ngOnInit(): void {
    this.user.auth$.subscribe((auth: any) => {
      if(auth) { console.log('Logged In'); }
    })
    this.gun.createSeaPair().then((seaPair) => {
      this.gun.loginWithSeaPair(seaPair);
    });
  }
}
