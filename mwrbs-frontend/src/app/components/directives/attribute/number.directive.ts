import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumber]'
})
export class NumberDirective {

  @Input() appNumber: Options;

  constructor(private el: ElementRef) {
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    const initalValue = this.el.nativeElement.value;
    const current: string = initalValue.replace(/[^0-9X\-]/g, '');
    const next: string = current.concat(this.getKey(+event.keyCode, event.key));
    let regex: RegExp;

    if (this.appNumber?.positive && !this.appNumber?.whole) {
      regex = new RegExp(/^-?[0-9X]+(\.[0-9X]*){0,1}$/g);
    } else if (!this.appNumber?.positive && this.appNumber?.whole) {
      regex = new RegExp(/^-?[0-9X-]+(\[0-9X-]*){0,1}$/g);
    } else if (this.appNumber?.positive && this.appNumber?.whole) {
      regex = new RegExp(/^-?[0-9X]+(\[0-9X]*){0,1}$/g);
    } else {
      regex = new RegExp(/^-?[0-9X-]+(\.[0-9X-]*){0,1}$/g);
    }

    if (!String(next).match(regex) || (current.length > 0 && event.key === '-')) {
      event.preventDefault();
    }
  }

  private getKey(keyCode: number, key: string) {
    if (keyCode === 45) {
      return '-';
    } else if (keyCode === 46) {
      return '.';
    } else {
      return key;
    }
  }

}

export interface Options {
  whole?: boolean; // whole number only
  positive?: boolean; // positive number only
}
