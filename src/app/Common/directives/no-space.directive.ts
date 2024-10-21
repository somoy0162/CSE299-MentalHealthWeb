import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[noSpace][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: NoSpaceDirective,
      multi: true
    }
  ]
})
export class NoSpaceDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return control.value && control.value.includes(' ') ? { 'noSpace': true } : null;
  }

}