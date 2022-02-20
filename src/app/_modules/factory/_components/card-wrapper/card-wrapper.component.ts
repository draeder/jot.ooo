import { Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';
import FormField from 'src/app/_classes/form-field';

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
  constructor(private gun: GunService, private user: UserService) { super(); }

  ngOnInit(): void {
    this.initilizeEditor();
    this.user.auth$.subscribe((auth: any) => {
      if(auth) { console.log('Logged In'); }
    })
    this.gun.createSeaPair().then((seaPair) => {
      this.gun.loginWithSeaPair(seaPair);
    });
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
}
