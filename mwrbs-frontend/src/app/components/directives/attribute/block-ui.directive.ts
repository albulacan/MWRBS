import { Directive, ElementRef, Input, OnChanges, SimpleChange } from '@angular/core';

declare var $: any;

@Directive({
  selector: '[appBlockUi]'
})
export class BlockUiDirective implements OnChanges {

  @Input() appBlockUi: boolean;

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: { [propertyName: string]: SimpleChange }) {
    if (changes['appBlockUi']) {
      const change = changes['appBlockUi'];
      if (change.currentValue) {
        $(this.elementRef.nativeElement).block({
          overlayCSS: {
              backgroundColor: '#fff'
          },
          message: '<img src="assets/img/theme/ajax-loader.gif" width="40" height="40" /> <span>Just a moment...</span>',
          css: {
              border: 'none',
              color: '#332',
              background: 'none',
              borderRadius: '5px'
          }
      });
      } else {
        $(this.elementRef.nativeElement).unblock();
      }
    }
  }

}
