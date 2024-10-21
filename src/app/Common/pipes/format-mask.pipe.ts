import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatMaskPipe implements PipeTransform {

  transform(value: string | number, format: string, type: 'string' | 'number' = 'string'): string {
    if (!value) {
      return '';
    }

    const stringValue = value.toString();
    var formatValue: string = "";
    if (type === "string") {
      var formatIndex: number = 0;
      [...format].forEach((char: string) => {
        if (char === "#") {
          formatValue += stringValue[formatIndex];
          formatIndex++;
        } else {
          formatValue += char
        }
      });
    } else if (type === "number") {

    }
    return formatValue;
  }
}
