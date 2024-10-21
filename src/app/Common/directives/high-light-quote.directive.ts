import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[highLightQuote]'
})
export class HighLightQuoteDirective {

  /**
   * target text: where want to find quotes?
   */
  @Input() highLightQuote: string = "";
  /**
   * Indicate a quote sign from the Text.
   */
  @Input() searchText: string = "";
  constructor(private el: ElementRef) {}

  protected ngOnChanges() {
    this.el.nativeElement.innerHTML = this.highLightQuote.split(' ').reduce((prev: string, current: string, index: number) => {
      const next = current.includes(this.searchText) ? `<span class="text-theme">${current}</span>` : current;
      return prev.concat(' ', next)
    });
  }
}
