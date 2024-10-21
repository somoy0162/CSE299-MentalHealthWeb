import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[onlyCharacter][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: OnlyCharacterDirective,
      multi: true
    }]
})
export class OnlyCharacterDirective implements Validator {

  constructor() { }

  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = new RegExp('[a-zA-Z\-_\(\)\.\,\:\s]');
    var invalid: boolean = false;
    [...control.value].forEach((text: string) => {
      if (!regex.test(text)) {
        invalid = true;
      }
    });
    return invalid ? { "invalidText": true } : null;
  }

}
