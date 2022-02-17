import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EditorService } from 'src/app/_services/editor.service';
import { HljsService } from 'src/app/_services/hljs.service';
import { debounce } from 'lodash';


@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements AfterViewInit {
  editorInstance: any;

  @ViewChild('editorContainer') editorContainer: ElementRef;
  @ViewChild('toolbar') toolbar: ElementRef;
  hljsInstance: any;
  highlight = debounce(() => {
    this.hljs.highlightQuillCode(this.hljsInstance);
  }, 800)
  constructor(private editorService: EditorService, private hljs: HljsService) {
    
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
      theme: 'snow'
    }

    this.editorInstance = this.editorService.initiate(containerRef.nativeElement, options);
    this.editorChange(this.editorInstance);
  }

  editorChange(quill: any) {
    quill.on('selection-change', (delta: any, oldDelta: any, source: string) => {
      this.highlight();
    });
  }

  focusIn() {
    this.editorInstance.focus();
  }
}
