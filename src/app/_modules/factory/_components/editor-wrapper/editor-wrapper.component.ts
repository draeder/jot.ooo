import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { EditorToolbar } from '../card-wrapper/card-wrapper.component';

@Component({
  selector: 'app-editor-wrapper',
  templateUrl: './editor-wrapper.component.html',
  styleUrls: ['./editor-wrapper.component.scss']
})
export class EditorWrapperComponent implements OnInit {
  editorForm: FormGroup;
  editorContent: any;
  constructor() { }

  ngOnInit(): void {
    this.initiateEditor();
  }

  initiateEditor() {
    this.editorForm = new FormGroup({
      metadata: new FormControl(new EditorToolbar()),
      content: new FormControl(''),
    });

    this.editorForm.valueChanges.subscribe((value: any) => {
      console.log('editor content change', value);
    });
  }

  updateContent(content: any, metadata?: EditorToolbar | null) {
    this.editorForm?.controls.content.setValue(content || null)

    if(metadata) {
      this.editorForm?.controls.metadata.setValue({
        private: metadata.private,
        title: metadata.title
      })
    }
  }
}
