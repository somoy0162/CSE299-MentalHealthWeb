import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../Common/shared/shared.module';
import { HeaderService } from '../../Common/service/header.service';
import { LocalstoreService } from '../../Common/service/localstore.service';
import { SystemUsers } from '../../Model/system-users';
import { SystemUserService } from '../../Common/service/system-user.service';
import { Subject, takeUntil } from 'rxjs';
import { ResponseStatus } from '../../Common/enums/appEnums';
import { MessageHelperService } from '../../Common/helper/message-helper.service';
import { VMPasswordChange } from '../../VM/vmpassword-change';


@Component({
  selector: 'app-account-manager',
  standalone: true,
  imports: [RouterLink,
    RouterModule,
    FormsModule,
    CommonModule,
    SharedModule
  ],
  templateUrl: './account-manager.component.html',
  styleUrl: './account-manager.component.css'
})
export class AccountManagerComponent {
  isShowPassword: boolean = false;
  isNewShowPassword: boolean = false;
  isConfirmShowPassword: boolean = false;
  private destroy: Subject<void> = new Subject<void>();
  systemUser: any;

  constructor(
    private headerService: HeaderService,
    private localstoreService: LocalstoreService,
    private systemUserService: SystemUserService,
    private messageHelperService: MessageHelperService
  ) {

  }

  ngOnInit(): void {
    Promise.resolve().then(() => this.headerService.setTitle('Account Manager'));
    this.systemUser = this.localstoreService.getData('User');
    if (this.systemUser && this.systemUser.PhoneNumber) {
      this.systemUser.PhoneNumber = this.formatPhoneNumber(this.systemUser.PhoneNumber);
    }
  }

  formatPhoneNumber(phoneNumber: string): string {
    // Remove any non-numeric characters except the initial "+88" if it exists
    let formattedInput = phoneNumber.replace(/[^0-9+]/g, '');

    // If the phone number starts with "01", prepend "+88"
    if (formattedInput.startsWith('01')) {
      formattedInput = `+88 ${formattedInput}`;
    } else {
      return phoneNumber;
    }

    // If the phone number doesn't start with "+88" and is longer than 2, ensure it's properly formatted
    if (!formattedInput.startsWith('+88') && formattedInput.length > 2) {
      formattedInput = `+88 ${formattedInput.slice(-11)}`; // Retain the last 11 digits
    }

    return formattedInput;
  }

  numbersOnlyValidator(event: any): void {
    const input = event.target.value;

    // Remove any non-numeric characters except the initial "+88" if it exists
    let formattedInput = input.replace(/[^0-9+]/g, '');

    // If the input starts with "01", prepend "+88" to it
    if (formattedInput.startsWith('01')) {
      formattedInput = `+88 ${formattedInput}`;
    }

    // If the input doesn't start with "+88" and is longer than 2, make sure it's not malformed
    if (!formattedInput.startsWith('+88') && formattedInput.length > 2) {
      formattedInput = `+88 ${formattedInput.slice(-11)}`; // Takes the last 11 digits if more numbers are entered
    }

    // Set the formatted input back to the input field
    event.target.value = formattedInput;
  }

  onSubmit() {
    var payload = {
      ...this.systemUser,
      PhoneNumber: this.systemUser.PhoneNumber.replace(/^(\+88\s?)?/, '')
    }
    this.systemUserService.updatePersonalDetails(payload)
      .pipe(takeUntil(this.destroy))
      .subscribe((response: any) => {
        this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        if (response.ResponseCode == ResponseStatus.success) {
          if (response.ResponseObj && response.ResponseObj.PhoneNumber) {
            response.ResponseObj.PhoneNumber = this.formatPhoneNumber(response.ResponseObj.PhoneNumber);
          }
          this.localstoreService.setData('User',this.systemUser);
        }
      });
  }

  confirmPasswordMatch(): void {
    // if (this.objPassword.newPassword != this.objPassword.confirmPassword) {
    //   this.passowrdForm.controls['confirmPassword'].setErrors({ 'matching': true });
    // } else {
    //   this.passowrdForm.controls['confirmPassword'].setErrors(null);
    // }
  }

  vmPasswordChange: VMPasswordChange = new VMPasswordChange();
  onUpdatePassword(): void {
    // if (form.invalid) {
    //   this.messageHelperService.showMessage(2, "Must be fill up required fill");
    //   return;
    // }

    var payload = {
      ...this.vmPasswordChange,
      SystemUserID: this.systemUser.SystemUserID
    }
    this.systemUserService.updatePassword(payload)
      .subscribe((response: any) => {
        this.messageHelperService.showMessage(response.ResponseCode, response.Message);
        if (response.ResponseCode == ResponseStatus.success) {
          this.vmPasswordChange = new VMPasswordChange();
        }
      });
  }

  ngOnDestroy(): void {
  }
}
