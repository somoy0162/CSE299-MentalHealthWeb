import { Injectable } from '@angular/core';
import { GlobalConfig, ToastrService } from 'ngx-toastr';
import * as appEnums from '../enums/appEnums'
@Injectable({
    providedIn: 'root'
})
export class MessageHelperService {

    private options: GlobalConfig | undefined;
    private projectName: string = "Counseling Center";

    constructor(
        private toastr: ToastrService
    ) { }

    showMessage(code: number, message: string) {
        if (code === appEnums.ResponseStatus.success) {
            this.toastr.success(message, this.projectName, {
                // disableTimeOut: true,
                // tapToDismiss: false,
                timeOut: 3000,
                toastClass: "toast-icon custom-toast-success"
            });
        }
        else if (code === appEnums.ResponseStatus.warning) {
            this.toastr.warning(message, this.projectName, {
                // disableTimeOut: true,
                // tapToDismiss: false,
                timeOut: 3000,
                toastClass: "toast-icon custom-toast-warning"
            });
        }
        else if (code === appEnums.ResponseStatus.info) {
            this.toastr.info(message, this.projectName, {
                // disableTimeOut: true,
                // tapToDismiss: false,
                timeOut: 3000,
                toastClass: "toast-icon custom-toast-info"
            });
        }
        else if (code === appEnums.ResponseStatus.fail) {
            this.toastr.error(message, this.projectName, {
                // disableTimeOut: true,
                // tapToDismiss: false,
                timeOut: 3000,
                toastClass: "toast-icon custom-toast-error"
            });
        }
        else if (code === null) {
            this.toastr.error(message, this.projectName, {
                // disableTimeOut: true,
                // tapToDismiss: false,
                timeOut: 3000,
                toastClass: "toast-icon custom-toast-error"
            });
        }
    }
}
