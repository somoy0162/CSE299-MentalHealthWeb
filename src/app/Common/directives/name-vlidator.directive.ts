import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[startEndnoSpace][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NameVlidatorDirective,
      multi: true
    }
  ]
})
export class NameVlidatorDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control.value) {
      return null;
    }
    if (control.value.startsWith(' ')) return { 'invalidName': true };
    else if (control.value.endsWith(' ')) return { 'invalidName': true };
    else return null;
  }
}
