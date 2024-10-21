import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'customDateFormatPipe',
})
export class CustomDateFormatPipe implements PipeTransform {
    transform(value: string) {
       const datePipe = new DatePipe('en-US');
       value = datePipe.transform(value, 'MM/dd/YYYY') || '';
       return value;
    }
}
