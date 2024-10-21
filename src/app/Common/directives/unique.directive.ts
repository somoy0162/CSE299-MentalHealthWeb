import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[unique][ngModel]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: UniqueDirective,
      multi: true
    }
  ]
})
export class UniqueDirective implements Validator {

  @Input() unique: boolean = false;
  constructor() { }
  validate(control: AbstractControl<any, any>): ValidationErrors | null {
    return control.value && this.unique ? null : { 'noUnique': true };
  }
}
