import { AfterViewInit, Component, ElementRef, forwardRef, ViewChild } from '@angular/core';
import { EditorService } from 'src/app/_services/editor.service';
import { HljsService } from 'src/app/_services/hljs.service';
import { debounce } from 'lodash';
import FormField from 'src/app/_classes/form-field';
import { NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => EditorComponent)
    }
  ]
})
export class EditorComponent extends FormField implements AfterViewInit {
  editorInstance: any;

  @ViewChild('editorContainer') editorContainer: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;
  hljsInstance: any;
  highlight = debounce(() => {
    this.hljs.highlightQuillCode(this.hljsInstance);
  }, 800)
  constructor(private editorService: EditorService, private hljs: HljsService) {
    super();
  }

  ngAfterViewInit(): void {
    this.hljs.init().then((hljsInstance) => {
      this.hljsInstance = hljsInstance;
    });

    this.initilizeEditor(this.editorContainer, this.toolbar);
  }

  initilizeEditor(containerRef: ElementRef, toolbar: ElementRef) {
    const options = {
      modules: {
        'toolbar': {
          container: toolbar.nativeElement,
          syntax: true,
        }
      },
      placeholder: 'Compose an epic...',
      theme: 'snow'
    }

    this.editorInstance = this.editorService.initiate(containerRef.nativeElement, options);
    this.editorChange(this.editorInstance);
  }

  editorChange(quill: any) {
    quill.on('selection-change', (delta: any, oldDelta: any, source: string) => {
      this.highlight();
    });
    quill.on('text-change', (delta: any, oldDelta: any, source: string) => {
      this.onChange(oldDelta?.ops)
    });
  }

  writeValue(editorContent: any): void {
      if(!editorContent) {
        this.editorInstance?.setContents([]);
        return;
      }

      if(typeof editorContent === 'object' || Array.isArray(editorContent)) {
        this.editorInstance?.setContents(editorContent);
      } else {
        this.editorInstance?.setText(editorContent);
      }
  }

  focusIn() {
    this.editorInstance.focus();
  }
}
