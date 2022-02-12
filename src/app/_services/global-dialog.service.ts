import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class GlobalDialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * mehtod to load a component as a dialog
   * @param component pass the component to be loaded
   * @param config pass the configuration for the dialog
   * @returns  Reference to the newly-opened dialog.
   */
  openDialog(component: ComponentType<unknown>, config: MatDialogConfig = {}): MatDialogRef<unknown, any> {
    const defaultConfig: MatDialogConfig = {
      width: '545px',
      height: 'auto',
      disableClose: true,
      autoFocus: true,
      closeOnNavigation: true,
      hasBackdrop: true,
      panelClass: 'general-dialog-container'
    };
    
    return this.dialog.open(component, {...defaultConfig, ...config});
  }
}
