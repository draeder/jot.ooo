import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { GunService } from '@services/gun.service';
import { UserService } from '@services/user.service';
import { environment } from 'src/environments/environment';
import { EditorToolbar } from '../card-wrapper/card-wrapper.component';
import { debounceTime, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { get } from 'lodash';

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
  constructor(private gun: GunService, private user: UserService, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // Subscribe to user's auth state
    this.user.auth$
      .subscribe((auth: any) => {
        if (!!auth) {
          // After user is logged in
          console.log('Logged In, trying to fetch saved data');
          this.gun.getPrivateStoreData(environment.defaultStoreName, this.componentName)
            .then((data) => {
              console.log('Data found', data);
            }).catch((err) => {
              console.log('data not found', err);
            });
        } else {
          if (this.editorForm) { this.editorForm.disable(); }
        }
      });
    this.initiateEditor();
  }

  initiateEditor(initialData?: any) {
    console.log('INITIATING EDITOR...', initialData);
    const { metadata, content } = initialData || {};
    this.editorForm = new FormGroup({
      metadata: new FormControl({ value: metadata || new EditorToolbar() }),
      content: new FormControl({ value: content || '' }),
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

  // saveData() {
  //   if (this.editorForm.value && this.editorForm.valid && !this.editorForm.pristine) {
  //     this.contentSaveStatus = LoadingStatus.LOADING;
  //     this.gun.createPrivateStore(environment.defaultStoreName, this.componentName, this.editorForm.value).then(() => {
  //       this.contentSaveStatus = LoadingStatus.SUCCESS;
  //     }).catch(() => {
  //       this.contentSaveStatus = LoadingStatus.ERROR;
  //     });
  //   } else {
  //     this.contentSaveStatus = null;
  //     console.log('INVALID FORM');
  //   }
  // }
}
