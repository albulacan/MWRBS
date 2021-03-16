import { ElementRef } from '@angular/core';
import { BsModalOption } from './bs-modal.directive';
import { BehaviorSubject } from 'rxjs';
declare var $: any;

export class BsModalService {
  constructor(private el: ElementRef, private option: BsModalOption) {
  }

  shown = new BehaviorSubject<boolean>(false);

  open() {
    $(this.el.nativeElement).modal(this.option);
    $(this.el.nativeElement).modal('show').on('shown.bs.modal', () => {
      $('body').css('overflow', 'hidden');
      this.shown.next(true);
    });
    const event = {
      onShown: (succesFunc: () => void) => {
        const subscription = this.shown.asObservable()
          .subscribe(() => {
            if (this.shown.value) {
              succesFunc();
              subscription.unsubscribe();
            }
          });
        return event;
      }
    };
    return event;
  }

  close() {
    $(this.el.nativeElement).modal('hide');
    if ($('.modal.show').length > 0) {
      $('body').css('overflow', 'hidden');
    } else {
      $('body').css('overflow', 'auto');
    }
  }

  closeBackdrop() {
    $(this.el.nativeElement).modal('hide');
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
