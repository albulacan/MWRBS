import { Directive, Input, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { BsModalService } from './bs-modal.service';

@Directive({
  selector: '[appBsModal]'
})
export class BsModalDirective implements OnInit {

  @Input() appBsModalOption: BsModalOption;
  @Output('appBsModal') modalService: EventEmitter<BsModalService> = new EventEmitter();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
    if (!this.appBsModalOption) {
      this.appBsModalOption = {
        backdrop: 'static',
        keyboard: false
      };
    }
    this.modalService.emit(new BsModalService(this.el, this.appBsModalOption));
  }

}

export interface BsModalOption {
  backdrop?: boolean|string;
  keyboard?: boolean;
  focus?: boolean;
  show?: boolean;
  yesNo?: boolean;
  size?: string;
}
