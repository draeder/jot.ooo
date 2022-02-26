import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';
import { environment } from 'src/environments/environment';
import { EditorToolbar } from '../card-wrapper/card-wrapper.component';
import { debounceTime, tap } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

export enum LoadingStatus {
  LOADING = 'loading',
  SUCCESS = 'success',
  ERROR = 'error',
}

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss']
})
export class EditorWrapperComponent implements OnInit {
  editorForm: FormGroup;
  editorContent: any;
  componentName = 'editorWrapperComponent';
  contentSaveStatus: LoadingStatus | null;
  constructor(private gun: GunService, private user: UserService) {
    // After Gun ready
    this.gun.gunOnReady().then(() => {
      // Subscribe to user's auth state
      this.user.auth$
        .subscribe((auth: any) => {
          if (auth) {
            // After user is logged in
            console.log('Logged In');
            if(this.editorForm) { this.editorForm.enable(); }
            // Check if store has data
            this.gun.getPrivateStoreData(environment.defaultStoreName, this.componentName)
              .then((data) => {
                if (data) {
                  // Populate the editor with data
                  this.editorContent = data?.content;
                  // Fill the form data
                  this.editorForm?.patchValue(data);
                }
              }).catch(() => {
                console.log('NO DATA IN STORE...');
              });
          } else {
            if(this.editorForm) { this.editorForm.disable(); }
          }
        });
    });
  }

  ngOnInit(): void {
    this.initiateEditor();

    // Login with Sear Pair
    this.gun.createSeaPair().then((seaPair) => {
      this.gun.loginWithSeaPair(seaPair);
    });
  }

  initiateEditor() {
    this.editorForm = new FormGroup({
      metadata: new FormControl({value: new EditorToolbar()}),
      content: new FormControl({ value: ''}),
    });

    this.editorForm.valueChanges
      .pipe(
        tap((value: any) => { if (value) { this.contentSaveStatus = LoadingStatus.LOADING; } }),
        debounceTime(1000) // 1 second delay
      )
      .subscribe((value: any) => {
        if (value && value.metadata && value.content) {
          this.gun.createPrivateStore(environment.defaultStoreName, this.componentName, value).then(() => {
            this.contentSaveStatus = LoadingStatus.SUCCESS;
          }).catch(() => {
            this.contentSaveStatus = LoadingStatus.ERROR;
          });
        } else {
          this.contentSaveStatus = null;
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
