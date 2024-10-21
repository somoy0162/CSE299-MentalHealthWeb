import { Pipe, PipeTransform } from "@angular/core";


@Pipe({
    name: 'SSNNumber'
})
export class SSNNUmberPipe implements PipeTransform {
    transform(value: string, type: number = 1): any {
        try {
            if (!value) return value;
            value = value.replace(' ', '').replace(/[^\w\s]/gi, '');
            return value.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3");
        } catch (error) {
            return value;
        }
    }
}