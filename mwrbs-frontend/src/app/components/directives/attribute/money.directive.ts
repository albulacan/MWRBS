import { AfterViewChecked, Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appMoney]'
})
export class MoneyDirective implements AfterViewChecked {

  @Output() ngModelChange: EventEmitter<any> = new EventEmitter();

  constructor(private el: ElementRef) {
  }

  ngAfterViewChecked() {
    if (this.el.nativeElement.value && (this.el.nativeElement.value as string).indexOf('%') <= -1) {
      this.el.nativeElement.value = this.formatAmount(this.el.nativeElement.value);
    }
  }

  @HostListener('keypress', ['$event']) onKeyPress(event: any) {
    const initalValue = this.el.nativeElement.value;
    const current: string = initalValue.replace(/[^0-9X\.-]/g, '');
    const next: string = current.concat(this.getKey(+event.keyCode, event.key));
    const regex: RegExp = new RegExp(/^-?[0-9X-]+(\.[0-9X-]*){0,1}$/g);

    if (!String(next).match(regex) || event.key === 'X' || (current.length > 0 && event.key === '-')) {
      event.preventDefault();
    }
  }

  @HostListener('input', ['$event']) onInputChange(event: any) {
    let value: string = this.el.nativeElement.value;
    event.preventDefault();
    if (!value || (value && value.indexOf('%') > -1)) {
      return;
    }
    value = this.formatAmount(value);
    this.el.nativeElement.value = value;
  }

  private formatAmount(value: string) {
    let isNegative = false;
    if (value.indexOf('-') > -1) {
      isNegative = true;
      value = value.replace(/-/g, '');
    }
    value = value.replace(/,/g, '');
    if (value.indexOf('.') > -1) {
      let left = value.substr(0, value.indexOf('.'));
      if (left.charAt(0) === '0' && left.length > 1) {
        left = left.replace(/^0+/, '');
      }
      const decimal = value.substring(value.lastIndexOf('.') + 1);
      left = this.formatWholeNo(left);
      value = `${left}.${decimal}`;
    } else {
      if (value.charAt(0) === '0' && value.length > 1) {
        value = value.replace(/^0+/, '');
      }
      value = this.formatWholeNo(value);
    }
    if (isNegative) {
      value = '-' + value;
    }
    return value;
  }

  private formatWholeNo(value: string) {
    const length = value.length;
    if (length > 3) {
      let group = Math.floor(length / 3);
      if (length % 3 === 0) {
        group--;
      }
      for (let i = 1; i <= group; i++) {
        const x = (length + (i - 1)) - ((i * 3) + (i - 1));
        value = value.substr(0, x) + ',' + value.substr(x);
      }
    }
    return value;
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

  @HostListener('blur', ['$event']) onBlur(event: any) {
    const value: string = this.el.nativeElement.value;
    if (value) {
      this.ngModelChange.emit(value.replace(/,/g, ''));
    }
  }

}
