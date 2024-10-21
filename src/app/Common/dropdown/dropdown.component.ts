import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, output } from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'dropdown',
  standalone: true,
  imports: [CommonModule, BsDropdownModule, FormsModule],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownComponent),
      multi: true
    }
  ]
})
export class DropdownComponent implements OnInit {

  @Output() customModelChange: EventEmitter<any> = new EventEmitter<any>();
  currentValues: any[] = [];
  constructor() { }

  ngOnInit(): void { }

  private _values: any = [];
  get values() {
    return this._values;
  }

  @Input() set values(value: any[]) {
    if (this.setting?.isMulti) {
      this._values = value?.map((m) => ({ ...m, selected: false }));
    } else {
      this._values = value;
    }
    this.currentValues = this.values.slice(0, 10);
  }

  @Input() setting: { display: string[], field: string, isMulti: boolean, header: boolean } | any;

  onApply(dropdown: any): void {
    dropdown?.hide();
    this.customModelChange.emit(this.getSelectedItems?.map((m) => m[this.setting.field]));
  }

  get getSelectedItems() {
    return this.values.filter((x) => x.selected) ?? [];
  }

  private _customModel: any;
  get customModel() {
    return this._customModel;
  }

  @Input() set customModel(value: any) {
    this._customModel = value;
    setTimeout(() => {
      if (this.setting?.isMulti) {
        this.values.forEach((x) => {
          x.selected = value?.includes((item: any) => x[this.setting.field]);
        });
      } else {
        this._customModel = value ?? 'Select'
      }
    }, 100);
    /**
     * for next impement exist
     */
  }

  onSelect(item: any) {
    if (this.setting?.isMulti) {
      this.customModel = this.values.filter((x) => x.selected);
      setTimeout(() => {
        this.selectAll = this.values.filter((x) => x.selected)?.length == this.values?.length;
      }, 100);
    } else {
      if (this.setting?.field) {
        this.customModel = item[this.setting.field];
      } else {
        this.customModel = item;
      }
      this.customModelChange.emit(this.customModel);
    }
  }

  selectAll: boolean = false;
  selectAllChange(selected: boolean) {
    this.values.forEach((x) => x.selected = selected);
  }

  onScroll(params: any) {
    var scrollHeight = params.srcElement.scrollHeight - params.srcElement.clientHeight;
    if (parseInt(params.srcElement.scrollTop) >= (scrollHeight - 5)) {
      const startIndex = this.currentValues.length;
      const endIndex = startIndex + 10;
      const value = this.values.slice(startIndex, endIndex);
      this.currentValues.push(...value);
    }
  }
}
