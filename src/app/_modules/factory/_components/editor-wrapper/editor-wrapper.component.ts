import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';
import { environment } from 'src/environments/environment';
import { EditorToolbar } from '../card-wrapper/card-wrapper.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss']
})
export class EditorWrapperComponent implements OnInit {
  editorForm: FormGroup;
  editorContent: any;
  constructor(private gun: GunService, private user: UserService) {
    // After Gun ready
    this.gun.gunOnReady().then(() => {
      // Subscribe to user's auth state
      this.user.auth$
        .subscribe((auth: any) => {
          if (auth) {
            // After user is logged in
            console.log('Logged In');
          }
        });
    });
  }

  ngOnInit(): void {
    // Login with Sear Pair
    this.gun.createSeaPair().then((seaPair) => {
      this.gun.loginWithSeaPair(seaPair);
    });

    this.initiateEditor();
    // Check if store has data
    this.gun.getPrivateStoreData(environment.defaultStoreName, 'formData').then((data) => {
      if(data) {
        console.log('----', data);
        
        this.editorContent = data?.content;
        this.editorForm.patchValue(data);
      }
    });
  }

  initiateEditor() {
    this.editorForm = new FormGroup({
      metadata: new FormControl(new EditorToolbar()),
      content: new FormControl(''),
    });

    this.editorForm.valueChanges.subscribe((value: any) => {
      if (value) {
        this.gun.createPrivateStore(environment.defaultStoreName, 'formData', value);
      }
    });
  }

  updateContent(content: any, metadata?: EditorToolbar | null) {
    this.editorForm?.controls.content.setValue(content || null)

    if (metadata) {
      this.editorForm?.controls.metadata.setValue({
        private: metadata.private,
        title: metadata.title
      })
    }
  }
}
