import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[formatMask]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: FormatMaskDirective,
      multi: true,
    },
  ],
})
export class FormatMaskDirective implements Validator {

  validtext = ['#', ',', '-', '(', ')', ' ', '.', '+'];

  constructor() { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {

    if (!control.value) {
      return null;
    }

    const arr = [...control.value];
    let invalid: boolean = false;
    for (let index = 0; index < arr.length; index++) {
      if (!this.validtext.includes(arr[index])) {
        invalid = true;
        break;
      }
    }

    return invalid ? { "invalidMaskTxt": true } : null;
  }
}
