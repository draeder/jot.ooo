import { Injectable } from '@angular/core';
import { LANGUAGES } from '../_models/globalconstants';
declare const hljs: any;

@Injectable({
  providedIn: 'root'
})
export class HljsService {

  private hl: any;

  constructor() {
  }

  public init() {
    return new Promise((resolve) => {
      this.configureHljs(hljs).then((hljsInstance: any) => {

        // highlight code blocks
        document.addEventListener('DOMContentLoaded', (event) => {
          this.highlightQuillCode(hljsInstance)
        });
        this.hl = hljsInstance;
        resolve(hljsInstance);
      });
    })
  }

  /**
   * Highlight code snippets
   * @param hljsInstance highlight.js instance
   */
  private configureHljs(hljsInstance: any) {
    return new Promise((resolve, reject) => {
      if (!hljsInstance) { return; }
      hljsInstance.configure({
        languages: LANGUAGES
      });
      resolve(hljsInstance);
    })
  }

  public get hljsInstance() {
    return this.hl;
  }

  public highlightQuillCode(hljsInstance: any) {
    hljsInstance.highlightAll();
    document.querySelectorAll('.ql-syntax').forEach((el) => {
      hljsInstance.highlightElement(el);
    });
  }
}
