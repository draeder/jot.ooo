import { Component } from '@angular/core';
import { GlobalDialogService } from 'src/app/_services/global-dialog.service';
import { LoginFormComponent } from '../login-form/login-form.component';

@Component({
  selector: 'app-user-login-menu',
  templateUrl: './user-login-menu.component.html',
  styleUrls: ['./user-login-menu.component.scss']
})
export class UserLoginMenuComponent {
  loggedIn: boolean;
  constructor(private dialogService: GlobalDialogService) { }

  openLoginMenu() {
    const dialogRef = this.dialogService.openDialog(LoginFormComponent);
  }
}
