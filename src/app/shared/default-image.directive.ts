import { Directive, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'onError()',
    '[src]': 'src'
  }
})
export class DefaultImageDirective {

  @Input() src: string = '';
  @Input() default: string = '';

  onError() {
    this.src = this.default ? this.default : '/assets/images/image-icon.jpg';
  }

}
