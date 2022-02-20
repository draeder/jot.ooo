import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  icon?: string;
  cancelButtonColor?: string;
  confirmButtonColor?: string;
  iconSize?: number;
  iconFont: string;
  iconColor?: string;
}

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent {
  dialogData: ConfirmationDialogData = {
    title: 'Confirmation',
    message: 'Are you sure you want to delete this item?',
    confirmButtonText: 'Yes',
    cancelButtonText: 'Cancel',
    icon: 'warning',
    iconSize: 40,
    iconFont: 'material-icons',
    cancelButtonColor: '',
    confirmButtonColor: 'warn',
    iconColor: ''
  }
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationDialogData) {
    if (data) {
      if(data.cancelButtonText) { this.dialogData.cancelButtonText = data.cancelButtonText; }
      if(data.confirmButtonText) { this.dialogData.confirmButtonText = data.confirmButtonText; }
      if(data.message) { this.dialogData.message = data.message; }
      if(data.title) { this.dialogData.title = data.title; }
      if(data.icon) { this.dialogData.icon = data.icon; }
      if(data.iconSize) { this.dialogData.iconSize = data.iconSize; }
      if(data.iconFont) { this.dialogData.iconFont = data.iconFont; }
      if(data.cancelButtonColor) { this.dialogData.cancelButtonColor = data.cancelButtonColor; }
      if(data.confirmButtonColor) { this.dialogData.confirmButtonColor = data.confirmButtonColor; }
      if(data.iconColor) { this.dialogData.iconColor = data.iconColor; }
    }
  }

  close(confirm?: boolean) {
    this.dialogRef.close(confirm);
  }
}
