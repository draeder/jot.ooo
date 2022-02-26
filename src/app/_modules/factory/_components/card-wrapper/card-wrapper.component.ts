import { Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { GlobalDialogService } from '@services/global-dialog.service';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';
import FormField from 'src/app/_classes/form-field';
import { environment } from 'src/environments/environment';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

export class EditorToolbar {
  title: '';
  private: '';
}

@Component({
  selector: 'app-card-wrapper',
  templateUrl: './card-wrapper.component.html',
  styleUrls: ['./card-wrapper.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CardWrapperComponent)
    }
  ]
})
export class CardWrapperComponent extends FormField implements OnInit {

  editorToolbarForm: FormGroup;
  constructor(private gun: GunService, private user: UserService, private dialogService: GlobalDialogService) { super(); }

  ngOnInit(): void {
    this.initilizeEditor();
  }

  initilizeEditor() {
    this.editorToolbarForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      private: new FormControl(true),
    });

    this.editorToolbarForm.valueChanges.subscribe((value: EditorToolbar) => this.onChange(value));
  }

  writeValue(formData: EditorToolbar): void {
    this.editorToolbarForm?.patchValue({...formData});
  }

  share() {
    this.gun.createQRimage();
  }

  delete() {
    const dialogRef = this.dialogService.openDialog(ConfirmationDialogComponent, {
      data: {
        title: 'Confirmation',
        message: 'Are you sure you want to delete this item?',
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
        iconColor: '#fcd33f'
      }
    });

    dialogRef.afterClosed().subscribe((confirm: boolean) => {
      console.log(confirm);
    })
  }
}
