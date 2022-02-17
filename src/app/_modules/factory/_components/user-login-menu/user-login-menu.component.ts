import { Component, Input } from '@angular/core';
import { GunService } from 'src/app/_services/gun.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-login-menu',
  templateUrl: './user-login-menu.component.html',
  styleUrls: ['./user-login-menu.component.scss']
})
export class UserLoginMenuComponent {
  loggedIn: boolean;
  constructor(private gun: GunService, private userService: UserService) { 
    this.userService.auth$.subscribe((auth: any) => {
      this.loggedIn = !!auth;
    });
  }

  login() {
    this.gun.createSeaPair().then((seaPair) => {
      this.gun.loginWithSeaPair(seaPair);
    });
  }

  logout() {
    this.gun.logout();
  }
}
