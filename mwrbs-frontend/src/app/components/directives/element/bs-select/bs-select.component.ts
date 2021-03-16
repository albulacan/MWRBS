import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-bs-select',
  templateUrl: './bs-select.component.html',
  styleUrls: ['./bs-select.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BsSelectComponent implements OnInit {

  @Input() title: string;
  @Input() disabled: boolean;
  @Input() options: BsSelectOption[];
  @Input() data: BsSelectOption[];
  @Output() dataChange = new EventEmitter<BsSelectOption[]>();

  groups = [] as string[];

  constructor() { }

  ngOnInit(): void {
    $('.selectpicker').selectpicker().on('changed.bs.select', (() => {
      this.setSelectedValues();
    }));
  }

  load(resetSelection: boolean = false) {
    this.groups = [];
    this.options?.forEach(x => {
      if (!this.groups.find(g => g === x.group)) {
        this.groups.push(x.group);
      }
    });

    let strOptions = '';
    this.groups?.forEach(g => {
      const groupOptions = this.options?.filter(x => x.group === g);
      if (!groupOptions?.length) {
        return;
      }
      const maxOptions = groupOptions[0]?.maxOption;
      strOptions = `${strOptions}<optgroup label="${g}" data-max-options="${maxOptions}">`;
      groupOptions.forEach(x => {
        strOptions = `${strOptions}<option value="${x.id}">${x.name}</option>`;
      });
      strOptions = `${strOptions}</optgroup>`;
    });

    $('.selectpicker').empty();
    $('.selectpicker').append(strOptions);
    $('.selectpicker').selectpicker('refresh');
    if (resetSelection) {
      $('.selectpicker').selectpicker('val', []);
    } else {
      if (this.data?.length) {
        const selectedIds = [] as number[];
        this.data.forEach(x => {
          selectedIds.push(x.id);
        });
        $('.selectpicker').selectpicker('val', selectedIds);
      }
    }
  }

  private setSelectedValues() {
    const selected = [] as BsSelectOption[];
    $('.selectpicker option:selected').map(function() {
      selected.push({id: this.value} as BsSelectOption);
    });
    this.data = selected;
    this.dataChange.emit(this.data);
  }

}

export interface BsSelectOption {
  group: string;
  maxOption: number;
  id: number;
  name: string;
}
