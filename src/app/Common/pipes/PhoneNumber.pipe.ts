import { Pipe, PipeTransform } from '@angular/core';
import { LocalstoreService } from '../service/localstore.service';

@Pipe({
    name: 'PhoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

    format = {
        format_1: "(000) 000-0000",
        format_2: "000-000-0000"
    }

    constructor(private localstoreService: LocalstoreService) { }

    transform(value: string, type: number = 1): any {
        try {
            // const defaultSetting: DefaultSettings = this.localstoreService.getData('selectedDefaultSettings');
            // type = defaultSetting && defaultSetting.PhoneNumberFormat == this.format.format_2 ? 2 : 1;
            if (!value) return value;
            value = value?.replace(' ', '')?.replace(/[^\w\s]/gi, '')?.replace(/\D+/g, '');
            switch (value?.length) {
                case 11:
                    if (type == 1) return value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 ($2) $3-$4");
                    else return value.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "+$1 $2-$3-$4");
                case 10:
                    if (type == 1) return value.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
                    else return value.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
                default:
                    if (type == 1) return value.replace(/(\d{3})(\d{3})(\d{3})/, "($1) $2-$3");
                    else return value.replace(/(\d{3})(\d{3})(\d{3})/, "$1-$2-$3");
            }
        } catch (error) {
            return value;
        }
    }
}
