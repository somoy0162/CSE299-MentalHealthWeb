import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[phoneValidator][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PhoneValidatorDirective,
      multi: true
    }]
})
export class PhoneValidatorDirective implements Validator {


  validate(control: AbstractControl<any, any>): ValidationErrors | null {

    var value = control.value?.replace(' ', '')?.replace(/[^\w\s]/gi, '')?.replace(/\D+/g, '');
    if (!control.value) return null;
    else if (control.value && !value) return { 'invalidPhoneText': true };
    else if (!control.value.match("[- +()0-9]+")) return { 'invalidPhoneText': true };
    else if (value.length < 10) return { 'minlength': true };
    else if (value.length > 11) return { 'maxlength': true };
    else return null;
  }
}