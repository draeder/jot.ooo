import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, forwardRef, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class EditorComponent extends FormField implements AfterViewInit, OnChanges {
  editorInstance: any;

  @Input() disabled: boolean;
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
    this.editorInstance.enable(!this.disabled);
  }

  editorChange(quill: any) {
    quill.on('selection-change', () => {
      this.highlight();
    });
    quill.on('text-change', () => {
      this.onChange(quill.getContents());
    });
  }

  writeValue(editorContent: any): void {    
      if(!editorContent) {
        this.editorInstance?.setContents([]);
        return;
      }

      console.log(editorContent);

      if(typeof editorContent === 'object' || Array.isArray(editorContent)) {
        this.editorInstance?.setContents(editorContent);
      } else {
        this.editorInstance?.setText(editorContent);
      }
  }

  focusIn() {
    this.editorInstance.focus();
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.disabled!==undefined || changes.disabled!==null) {
      this.editorInstance?.enable(!changes.disabled.currentValue);
    }
  }
}
