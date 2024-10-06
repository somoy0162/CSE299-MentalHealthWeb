import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[errorMessage]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ErrorMessageDirective,
      multi: true
    }]
})
export class ErrorMessageDirective implements Validator {

  private errorMessages: any = {
    required: "A non empty value required",
    minlength: "Minimum length need to exceeded",
    maxlength: "Maximum length exceeded",
    pattern: "Input format invalid",
    noUnique: "A unique value is required",
    invalidPhoneText: "Only number and (, ), - are allowed.",
    invalidName: "space not allowed in the Initial and end of the Text",
    invalidText: "a to z A to Z . , ( ) : - _ Only these are allowed",
    invalidMaskTxt: "Only # , . ( ) - + are allowed"
  }

  constructor(
    private el: ElementRef,
    private renderer: Renderer2) { }

  validate(control: AbstractControl): ValidationErrors | null {

    const formGroup: any = control?.parent?.controls;
    const controlName = Object.keys(formGroup).find(name => control === formGroup[name]) || null;
    const id = controlName + "_error";
    if (!control.dirty) {
      return null;
    }

    setTimeout(() => {
      if (control.errors) {
        const div: HTMLDivElement = this.renderer.createElement('div');
        div.id = id;
        div.className = "invalid-feedback";
        document.getElementById(id)?.remove();
        div.innerHTML = this.createMessage(control.errors);
        this.renderer.appendChild(this.el.nativeElement.parentElement, div)
      } else if (!control.errors || control.valid) {
        document.getElementById(id)?.remove();
      }
    }, 200);
    return null;
  }

  private createMessage(errors: any): string {
    var keys = Object.keys(errors);
    var errorName = keys[keys.length - 1];
    return this.errorMessages[errorName] ?? "";
  }

  
}
