import { Injectable } from '@angular/core';

declare const Quill: any;
const Clipboard = Quill.import('modules/clipboard');


export interface IconConfig {
  name: string;
  icon: string;
};

@Injectable({
  providedIn: 'root'
})
export class EditorService {

  /**
   * get the default configuration for the editor
   */
  defaultConfig: any;

  /**
   * create a new editor Instance
   */
  editorInstance: any;

  constructor() { }

  /**
   * Method to set the custom icons
   * @param iconData pass the icon data or icon data array
   */
  setCustomIcons(iconData: IconConfig | IconConfig[], iconFontType: string = 'fa') {
    const icons = Quill.import('ui/icons');

    if(typeof iconData === 'object' && !Array.isArray(iconData)) {
      icons[iconData.name] = `<i class="${iconFontType}">${iconData.icon}</i>`;
    }

    if(Array.isArray(iconData)) {
      iconData.map((data) => {
        icons[data.name] = `<i class="${iconFontType}">${data.icon}</i>`;
      })
    }
  }

  /**
   * Initiate the editor instance
   */
  initiate(container: string | Element, config: any = this.defaultConfig) {
    this.editorInstance = new Quill(container, config);
    return this.editorInstance;
  }

  /**
   * Get data back from the editor
   * @returns 
   */
  getData() {
    return this.editorInstance.getContents();
  }
  
  /**
   * Get data back from the editor
   * @returns 
   */
  setData(delta: any[]) {
    return this.editorInstance.setContents(delta);
  }

  /**
   * Method to convert Quill Delta into HTML string
   * @param inputDelta Quill Delta
   * @returns string
   */
  quillGetHTML(inputDelta: any) {
    let tempCont = document.createElement("div");
    new Quill(tempCont).setContents(inputDelta);
    return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
  }
}
