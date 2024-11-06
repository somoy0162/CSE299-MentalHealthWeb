import { Pipe, PipeTransform } from '@angular/core';
import { LocalstoreService } from '../service/localstore.service';

@Pipe({
    name: 'PhoneNumber'
})
export class PhoneNumberPipe implements PipeTransform {

    // Transform method to format phone numbers for display
    transform(value: string): string {
        if (!value) {
            return value;
        }

        // Remove any non-numeric characters except the initial "+88"
        let formattedPhoneNumber = value.replace(/[^0-9+]/g, '');

        // If it starts with "01", prepend "+88"
        if (formattedPhoneNumber.startsWith('01')) {
            formattedPhoneNumber = `+88 ${formattedPhoneNumber}`;
        }

        // If it doesn't start with "+88" and is long enough, fix the format
        if (!formattedPhoneNumber.startsWith('+88') && formattedPhoneNumber.length >= 11) {
            formattedPhoneNumber = `+88 ${formattedPhoneNumber.slice(-11)}`;
        }

        return formattedPhoneNumber;
    }

    // Parse method to strip "+88" before saving
    parse(value: string): string {
        if (!value) {
            return value;
        }

        // Remove "+88" prefix if present
        return value.replace(/^(\+88\s?)?/, '');
    }
}
