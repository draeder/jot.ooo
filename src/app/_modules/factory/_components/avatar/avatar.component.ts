import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
})
export class AvatarComponent {

  /**
   * Avatar size: small | large
   */
  @Input()
  set size(value: string) {
    if ( ['small', 'large'].includes(value) ) {
      this.avatarSize = value;
    }
  }

  get size(): string {
    return this.avatarSize;
  }

  private avatarSize = 'small';

  /**
   * Avatar initials
   */
  @Input()
  initials = 'BZ';

  /**
   * Initial Avatar image
   */
  @Input()
  srcPicture: string;

  /**
   * set Supported formats
   */
  @Input()
  set supportedFormats(format: string[]) {
    if (format && format.length > 0) {
      format.map((ext: string) => {
        this.formats.push(`image/${ext}`);
      });
    }
  }

  /**
   * Hold the received formats
   */
  formats: string[] = [];

  /**
   * Enable avatar image change
   */
  @Input()
  editable = false;

  /**
   * Display a green online badge
   */
  @Input()
  online = false;

  /**
   * Emit the newly uploaded image as a base64 string
   */
  @Output()
  avatarChange: EventEmitter<any> = new EventEmitter();

  /**
   * Input file used for avatar image change
   */
  @ViewChild('uploadInput')  uploadInput: ElementRef;

  /**
   * Hold latest uploaded image
   */
  uploadedPicture: string;

  constructor() { }

  /**
   * open file browser only if avatar edit is enabled
   */
  onAvatarClick(): void {
    if (this.editable) {
      this.uploadInput.nativeElement.click();
    }
  }

  /**
   * Read and show a preview of uploaded image
   * @param event file change event
   */
  onAvatarUpload(event: any): void {
      const resp: any = {
        status: null,
        file: null,
        message: null
      };

      if (event.target.files && event.target.files[0]) {
        const isImage = this.formats.length > 0
          ? this.formats.indexOf(event.target.files[0].type) > -1 : event.target.files[0].type.includes('image');

        if (!isImage) {
          resp.status = false;
          resp.message = 'Invalid image format';
        } else {
          const reader = new FileReader();

          reader.readAsDataURL(event.target.files[0]);

          reader.onload = (res: any) => {
            this.uploadedPicture = res.target.result.toString();
            resp.status = true;
            resp.message = 'Success';
            resp.file = this.uploadedPicture;
          };
        }

        this.avatarChange.emit(resp);
      }
  }

  /**
   * get uploaded/initial image to display
   */
  get imgUrl(): string {
    return this.uploadedPicture || this.srcPicture;
  }

  /**
   * get applied classes list
   */
  get classList(): string[] {
    return [`jt-${this.size}`];
  }

}
